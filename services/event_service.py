import datetime
from fastapi import HTTPException, status, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi.encoders import jsonable_encoder

# application imports
from schemas.event_schema import (
    EventCreate, 
    EventResp, 
    TicketStatus, 
    CreateCheckoutSession, 
    OrderStatus, 
    OrderRep, 
    EventListsResp,
    EventDetails,
)
from controllers.event_controllers import event_control
from utils.redis_utils import acquire_ticket_lock
from utils.stripe_utils import stripe, create_stripe_price
from core.config import stripe_settings

class EventService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.event_control = event_control(self.db)

    async def create_tickets(self, event_id: int, total_ticket: int):
        """
        This function creates the total number of tickets as specified for the 
        particular event
        """
        tickets=[]
        for i in range(0,total_ticket):
            tickets.append({"status":TicketStatus.AVAILABLE,"event_id":event_id})
        await self.event_control.create_bulk_new_tickets(tickets)

    async def get_all_events(self)->EventListsResp:
        """
        This function retrieves the list of all the events
        """
        events = await self.event_control.get_all_events()
        events = [EventDetails.model_validate(event) for event in events]
        resp = {
            "message":"Events retrieved successfully",
            "data": events,
            "status": status.HTTP_200_OK
        }
        return resp

    async def create_new_event(self, new_event: EventCreate, background_task: BackgroundTasks)-> EventResp:
        """
        This function handles the creation of a new event by validating the scheduled date, creating a Stripe 
        price for the event, and saving the event details. It ensures the scheduled date is in the future, 
        processes the event data, and asynchronously generates tickets using a background task. The response 
        includes a success message, event data, and an HTTP 201 status.
        """
        # validates the schedule date
        if new_event.schedule_date < datetime.datetime.now(datetime.timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Scheduled date or time should be greater than current date or time"
            )
        # ignoring the timezone
        new_event.schedule_date = new_event.schedule_date.replace(tzinfo=None)

        # creates the stripe price id for the new event
        stripe_price_id = await create_stripe_price(event_name=new_event.name, price=new_event.price)
        new_event = new_event.model_dump(exclude_unset=True)
        new_event["stripe_price_id"] = stripe_price_id

        # creates the new event
        created_event = await self.event_control.create_new_event(new_event)

        # creates the total tickets available for the event in the background
        background_task.add_task(self.create_tickets,event_id=created_event.id, total_ticket=created_event.total_tickets)
        resp = {
            "message": "Event created successfully",
            "data": created_event,
            "status": status.HTTP_201_CREATED
        }
        return resp
    
    async def book_ticket(self, ticket_id: int, event_id: int, user_id: int):
        """
        This function facilitates the process of booking a ticket for an event 
        by validating the event and ticket existence, ensuring the ticket's availability, 
        and locking it for the booking process. If successfully locked, it initiates a 
        Stripe checkout session for payment and creates a new order with a pending status. 
        The function handles potential conflicts and provides appropriate responses, ensuring 
        a secure and seamless booking experience for the user.
        """
        # validates the event and ticket
        event = await self.event_control.get_event_by_id(event_id=event_id)
        stripe_price_id = event.stripe_price_id
        if not event:
            raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No such event exist"
                )
        ticket = await self.event_control.get_ticket_by_id(ticket_id=ticket_id)
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No such ticket exists"
            )
        
        # checks the status of the tickets
        if ticket.status == TicketStatus.SOLD or ticket.status == TicketStatus.LOCKED:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ticket is already sold or booked"
            )
        
        # acquiring the lock on the particular ticket
        locked = await acquire_ticket_lock(ticket_id)
        if locked:

            # if ticket lock is successful update the database with ticket status
            ticket = await self.event_control.get_ticket_by_id_and_event_id(ticket_id, event_id=event_id)
            updated_ticket = await self.event_control.update_ticket_status(ticket=ticket, status=TicketStatus.LOCKED)

            # creating the session checkout for the particular event
            session_data = {
                "price_id":stripe_price_id, 
                "quantity":1,
                "success_url":"http://127.0.0.1:8000", 
                "cancel_url":"http://127.0.0.1:8000"
            }
            checkout_session = CreateCheckoutSession(**session_data)
            resp = await self.create_stripe_session_checkout(data = checkout_session)

            # creating a new order
            new_order_dict = {
                "user_id": user_id,
                "event_id": event_id,
                "status": OrderStatus.PENDING,
                "stripe_session_id": resp["id"],
                "ticket_id": ticket_id,
            }
            try:
                new_order = await self.event_control.add_new_order(new_order_dict)
            except IntegrityError:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Order for this ticket is in pending state"
                )
            message = "Ticket booked successfully. Please proceed to payment"
            status_code = status.HTTP_200_OK
            data = resp
            resp ={
            "message": message,
            "status": status_code,
            "data": data or None
        }
        else:
            message = "Ticket is already booked"
            status_code = status.HTTP_409_CONFLICT
            resp ={
            "message": message,
            "status": status_code,
        }
        return resp
    
    async def update_ticket_status(self, ticket_id: int, status:TicketStatus):
        """
        This function updates the ticket status
        """
        ticket = await self.event_control.get_ticket_by_id(ticket_id)
        updated_ticket = await self.event_control.update_ticket_status(ticket, status)

    
    # stripe session checkout
    async def create_stripe_session_checkout(self, data:CreateCheckoutSession):
        """
        This function creates a Stripe checkout session for processing payments. 
        It utilizes the Stripe API to generate a session with specified line items, 
        payment mode, and URLs for success and cancellation redirects. Upon success, 
        it returns the session ID and URL. In case of any Stripe-related errors, it 
        raises an HTTP exception with an appropriate error message.

        """
        try:
            session = stripe.checkout.Session.create(
                line_items=[{
                    'price': data.price_id,
                    'quantity': data.quantity,
                }],
                mode='payment',
                success_url=data.success_url,
                cancel_url=data.cancel_url,
            )
            resp = {
                "id": session.id, 
                "url": session.url
                }
            return resp
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def stripe_webhook_service(self, request: Request):
        """
        This function handles Stripe webhook events to manage ticket orders 
        based on payment outcomes. It verifies the webhook's signature for 
        authenticity and processes the checkout.session.completed event to 
        update order and ticket statuses accordingly. If the payment is successful, 
        the order status is set to confirmed, and the ticket is marked as sold. For 
        failed payments, the order is marked as failed, the ticket status is reset to 
        available, and any ticket lock is released. It ensures secure and accurate 
        handling of Stripe notifications and maintains system integrity.
        """
        try:
            # strip signature validation
            stripe_signature = request.headers.get('stripe-signature')
            if not stripe_signature:
                raise HTTPException(
                    status_code=400, 
                    detail="Missing stripe-signature header"
                )
            
            # Get the raw request body
            payload = await request.body()
            
            # Verify webhook signature
            event = stripe.Webhook.construct_event(
                payload,
                stripe_signature,
                stripe_settings.WEBHOOK_CODE
            )
            
            # Handle checkout.session.completed event
            if event.type == 'checkout.session.completed':
                session = event.data.object
                
                # update the order status with Confirmed
                order = await self.event_control.get_order_by_stripe_session_id(session_id=session.get("id"))
                updated_order = await self.event_control.update_order_status(order=order, status=OrderStatus.CONFIRMED)

                # update ticket status with Sold
                ticket = await self.event_control.get_ticket_by_id(int(updated_order.ticket_id))
                updated_ticket = await self.event_control.update_ticket_status(ticket,TicketStatus.SOLD)
                
                return {"status": "success"}
            
            else:
                # update the order status with Failed
                order = await self.event_control.get_order_by_stripe_session_id(session_id=session.get("id"))
                updated_order = await self.event_control.update_order_status(order=order, status=OrderStatus.FAILED)

                # update ticket status with Available
                ticket = await self.event_control.get_ticket_by_id(int(updated_order.ticket_id))
                updated_ticket = await self.event_control.update_ticket_status(ticket,TicketStatus.AVAILABLE)

                # release the lock from the ticket
                from utils.redis_utils import release_ticket_lock
                removed_lock = await release_ticket_lock(ticket_id=int(updated_order.ticket_id))
                
                return {"status": "failed"}
            
        except stripe.error.SignatureVerificationError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    async def get_customer_order(self, order_id: int, user_id: int)-> OrderRep:
        """
        This function retrieves a specific customer's order by validating the order and user association. 
        If the order exists, it compiles order details, including the associated event, ticket ID, and order 
        status. The response includes a success message, status code, and the retrieved data. If the order is 
        not found, it raises a 404 Not Found exception with an appropriate message.
        """
        orders = await self.event_control.get_order_by_order_and_user_id(order_id=order_id,user_id=user_id)
        if not orders:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ready to order."
            )
        data ={
                "event": await self.event_control.get_event_by_id(event_id=int(orders.event_id)),
                "ticket_id": orders.ticket_id,
                "status": orders.status
            }
            
        resp = {
            "message": "Customer's order retrieved successfully",
            "status": status.HTTP_200_OK,
            "data": data
        }
        return resp

event_service = EventService