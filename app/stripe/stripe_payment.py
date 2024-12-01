import os

import stripe
from fastapi import status, Request

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from app.custom_exception import EventNotFound
from app.db_connection import get_db
from app.enums import TicketStatus
from app.models import Events, Tickets
from app.stripe.schemas import PaymentResponse, PaymentCreate

load_dotenv()

stripe.api_key = os.getenv("STRIPE_KEY", None)
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", None)

payment_router = APIRouter(tags=["payments"])


@payment_router.post("/create-payment-intent/", response_model=PaymentResponse)
def create_payment_intent( payment_data: PaymentCreate, db: Session = Depends(get_db)):
    """
    Create a Stripe Payment Intent for ticket purchase

    - Calculates total price
    - Creates payment intent
    - Prepares for ticket booking
    """
    # Fetch the event to get ticket price
    event = db.query(Events).filter(Events.id == payment_data.event_id).first()
    if not event:
        raise EventNotFound

    # Calculate total price
    total_price = event.price * payment_data.number_of_tickets

    try:
        # Create Stripe Payment Intent
        payment_intent = stripe.PaymentIntent.create(
            amount=total_price * 100,  # Convert to cents
            currency="usd",
            metadata={
                "event_id": payment_data.event_id,
                "number_of_tickets": payment_data.number_of_tickets,
                "user_id": payment_data.user_id
            },
            # Optional: add more configuration like payment method types
            payment_method_types=["card"]
        )

        return {
            "client_secret": payment_intent.client_secret,
            "payment_intent_id": payment_intent.id
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@payment_router.post("/webhook/")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Handle Stripe webhook events

    - Verify webhook signature
    - Process payment events
    - Manage ticket booking
    """
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        # Verify webhook signature
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle different event types
    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object

        # Retrieve metadata
        metadata = payment_intent.metadata
        event_id = int(metadata.get('event_id'))
        number_of_tickets = int(metadata.get('number_of_tickets'))
        user_id = int(metadata.get('user_id'))

        try:
            # Book tickets
            new_tickets = [
                Tickets(
                    event_id=event_id,
                    user_id=user_id,
                    number_of_tickets=1,  # Individual ticket
                    status=TicketStatus.BOOKED.value,
                    payment_intent_id=payment_intent.id
                ) for _ in range(number_of_tickets)
            ]

            db.add_all(new_tickets)
            db.commit()

            # Optional: Send confirmation email, etc.
            return JSONResponse(content={"status": "success"})

        except Exception as e:
            db.rollback()
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )

    return JSONResponse(content={"received": True})
