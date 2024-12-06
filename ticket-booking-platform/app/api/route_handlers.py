import uuid
from typing import List
from pydantic import BaseModel
from fastapi import HTTPException, Request, Depends, Query
from fastapi.responses import RedirectResponse

from app.repositories.redis import get_redis_client
from app.models import (
    ticket as ticket_orm,
    order as order_orm,
    event as event_orm,
    user as user_orm,
)
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.event import EventSqlRepository
from app.repositories.user import UserSqlRepository
from app.repositories.ticket import TicketRepository
from app.repositories.order import OrderRepository
from app.schemas.event_schema import EventCreate, EventUpdate
from app.schemas.user_schema import UserCreate, UserUpdate
from app.services.stripe import create_stripe_checkout_session
from app.models.order import Order
from app.models.ticket import Ticket
from app.services.stripe import StripeWebhookService
from app.services.kafka_producer import KafkaEventProducer
from app.models.ticket import Ticket, TicketStatus
import logging
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

logger = logging.getLogger(__name__)


class EventView:
    @classmethod
    def create_event(
        cls, request: Request, event: EventCreate, db: Session = Depends(get_db)
    ):
        event_repository = EventSqlRepository(db)
        created_event = event_repository.create_event(event.dict())

        ticket_repo = TicketRepository(db)

        # Create tickets for the event
        for _ in range(event.total_tickets):
            ticket_repo.create_ticket(event_id=created_event.id)

        return {"event_id": created_event.id, "message": "Event created successfully."}

    @classmethod
    def update_event(
        cls, event_id: uuid.UUID, event: EventUpdate, db: Session = Depends(get_db)
    ):
        event_repository = EventSqlRepository(db)
        updated_event = event_repository.update_event(event_id, event.dict())
        return {"event_id": updated_event.id, "message": "Event updated successfully."}

    @classmethod
    def delete_event(cls, event_id: uuid.UUID, db: Session = Depends(get_db)):
        event_repository = EventSqlRepository(db)
        event_repository.delete_event(event_id)

    @classmethod
    async def list_events(
        cls,
        request: Request,
        page: int = Query(
            1, ge=1
        ),  # Default to page 1, must be greater than or equal to 1
        size: int = Query(
            10, ge=1, le=100
        ),  # Default size 10, must be between 1 and 100
        db: Session = Depends(get_db),
    ):
        event_repo = EventSqlRepository(db)
        events, total_events = event_repo.get_events(page, size)
        return {
            "page": page,
            "size": size,
            "total_events": total_events,
            "events": events,
        }


class UserView:
    @classmethod
    async def list_users(
        cls,
        request: Request,
        page: int = Query(
            1, ge=1
        ),  # Default to page 1, must be greater than or equal to 1
        size: int = Query(
            10, ge=1, le=100
        ),  # Default size 10, must be between 1 and 100
        db: Session = Depends(get_db),
    ):
        user_repo = UserSqlRepository(db)
        users, total_users = user_repo.get_users(page, size)
        return {
            "page": page,
            "size": size,
            "total_users": total_users,
            "users": users,
        }

    @classmethod
    async def create_user(cls, user: UserCreate, db: Session = Depends(get_db)):
        user_repository = UserSqlRepository(db)

        # Check if the email already exists
        existing_user = user_repository.get_user_by_email(user.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered.")

        # Create a new user
        new_user = user_repository.create_user(user)
        return new_user

    @classmethod
    async def update_user(
        cls, user_id: uuid.UUID, user: UserUpdate, db: Session = Depends(get_db)
    ):
        user_repository = UserSqlRepository(db)

        updated_user = user_repository.update_user(user_id, user)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found.")

        return updated_user

    @classmethod
    async def login(
        cls,
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db),
    ):
        user_repository = UserSqlRepository(db)

        # Authenticate user
        user = user_repository.get_user_by_email(form_data.username)
        if not user or not user_repository.pwd_context.verify(
            form_data.password, user.hashed_password
        ):
            raise HTTPException(status_code=400, detail="Invalid username or password.")

        # Generate tokens
        access_token = user_repository.create_access_token(str(user.id))
        refresh_token = user_repository.create_refresh_token(str(user.id))
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    @classmethod
    async def refresh_token(cls, refresh_token: str, db: Session = Depends(get_db)):
        user_repository = UserSqlRepository(db)

        # Decode refresh token
        user_id = user_repository.decode_token(refresh_token, expected_type="refresh")
        user = user_repository.get_user(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        # Generate new access token
        access_token = user_repository.create_access_token(str(user.id))
        return {"access_token": access_token, "token_type": "bearer"}

    @classmethod
    async def get_current_user(
        cls, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
    ):
        user_repository = UserSqlRepository(db)
        user_id = user_repository.decode_token(token)
        user = user_repository.get_user(user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found.")
        return user


class BookingView:
    @classmethod
    def book_ticket(
        cls,
        request: Request,
        event_id: uuid.UUID,
        # user_id: uuid.UUID,
        quantity: int,
        db: Session = Depends(get_db),
    ):
        user = getattr(request.state, "user", None)
        if not user:
            raise HTTPException(status_code=401, detail="Authentication required.")

        ticket_repo = TicketRepository(db)
        event_repo = EventSqlRepository(db)
        order_repo = OrderRepository(db)

        # Get Redis client
        redis_client = get_redis_client()

        # Check ticket availability
        tickets = ticket_repo.get_available_tickets(event_id)
        logger.info(f"Fetched tickets: {tickets}")

        if len(tickets) < quantity:
            raise HTTPException(status_code=400, detail="Not enough tickets available.")

        # Prepare to lock the tickets
        locked_tickets = []
        try:
            for ticket in tickets[:quantity]:
                lock_key = f"ticket_{ticket.id}_lock"
                if redis_client.acquire_lock(
                    lock_key, timeout=300
                ):  # 5 minutes timeout
                    locked_tickets.append(ticket)
                else:
                    logger.warning(f"Lock failed for ticket ID: {ticket.id}")
                    raise HTTPException(
                        status_code=423,
                        detail="Some tickets are currently locked. Try again later.",
                    )

            # Reserve the tickets
            ticket_repo.lock_tickets([ticket.id for ticket in locked_tickets])

            # Get event details
            event = event_repo.get_event_by_id(event_id)

            # Create a Stripe checkout session
            stripe_session, stripe_tracking_id = create_stripe_checkout_session(
                amount=event.price * quantity,  # Total amount based on quantity
                quantity=quantity,
                product_name=event.name,
                currency="usd",
            )
            logger.info(f"Stripe session created: {stripe_tracking_id}")
            # Create an order in the database
            order = order_repo.create_order(
                user_id=user.id,
                event_id=event_id,
                stripe_session_id=stripe_tracking_id,
            )

            logger.info(
                f"Trying to create order: {order.id} and for tickets: {locked_tickets}"
            )
            order_repo.create_tickets_for_order(
                order_id=order.id,
                ticket_ids=[ticket.id for ticket in locked_tickets],
            )

            # Publish ticket availability to Kafka
            kafka_producer = KafkaEventProducer()
            kafka_producer.publish_ticket_availability(
                event_id=event_id, status="locked", tickets=quantity
            )

            return {
                "order_id": str(order.id),
                "message": "Order created. Complete payment to confirm booking.",
                "url": stripe_session.url,  # Include this in the response
            }
        except HTTPException as http_exc:
            logger.error(f"HTTP Exception occurred: {http_exc.detail}")
            raise
        except Exception as e:
            logger.error(f"An error occurred: {str(e)}")
            # Release the locks on tickets in case of an error
            for ticket in locked_tickets:
                redis_client.release_lock(f"ticket_{ticket.id}_lock")
            raise HTTPException(
                status_code=500,
                detail="An unexpected error occurred. Please try again.",
            )


class StripeWebhookView:
    @classmethod
    async def handle_payment_webhook(
        cls, request: Request, db: Session = Depends(get_db)
    ):
        payload = await request.json()  # Extract the payload from the request body
        event_type = payload.get("type")
        data = payload.get("data", {}).get("object", {})

        strip_tracking_id = data.get("metadata", {}).get("tracking_id")

        total_amount = data.get("amount")

        print(f"Received webhook event: {strip_tracking_id}", flush=True)

        print(f"Payload {payload}", flush=True)

        redis_client = get_redis_client()

        service = StripeWebhookService(db)
        order_repo = OrderRepository(db)
        ticket_repo = TicketRepository(db)
        kafka_producer = KafkaEventProducer()
        user_repo = UserSqlRepository(db)

        order = order_repo.get_order_by_stripe_session_id(strip_tracking_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found.")

        ticket_ids = order_repo.get_tickets_for_order(order.id)

        if not ticket_ids:
            raise HTTPException(status_code=404, detail="Tickets not found.")

        print(f"Received webhook event: {event_type}", flush=True)

        if event_type == "payment_intent.succeeded":
            print(f"Payment succeeded for order: {order.id}", flush=True)

            ticket_repo.update_ticket_status(ticket_ids, ticket_orm.TicketStatus.SOLD)

            service.handle_payment_intent_succeeded(strip_tracking_id)
            kafka_producer.publish_payment_notification(
                order_id=str(order.id),
                status="success",
                amount=total_amount,
                user_id=str(order.user_id),
            )
            for ticket_id in ticket_ids:
                lock_key = f"ticket_{ticket_id}_lock"
                redis_client.release_lock(lock_key)
                print(f"Lock released for ticket: {ticket_id}", flush=True)

        elif event_type in [
            "payment_intent.cancelled",
            "payment_intent.payment_failed",
        ]:
            ticket_repo.release_tickets(ticket_ids)
            print(f"Releasing locks for tickets: {ticket_ids}", flush=True)
            for ticket_id in ticket_ids:
                lock_key = f"ticket_{ticket_id}_lock"
                redis_client.release_lock(lock_key)
                print(f"Lock released for ticket: {ticket_id}", flush=True)

            print(f"Payment failed for order: {order.id}", flush=True)
            service.handle_payment_intent_failed(strip_tracking_id)
            kafka_producer.publish_payment_notification(
                order_id=order.id,
                status="failed",
                amount=total_amount,
                user_id=order.user_id,
            )
            print(f"Payment failed for order: {order.id}", flush=True)
        else:
            raise HTTPException(status_code=400, detail="Unsupported event type.")
        return {"message": "Webhook handled successfully."}
