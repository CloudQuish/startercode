import os
import uuid
import stripe
from app.models.ticket import TicketStatus
from app.repositories.order import OrderStatus
from app.repositories.order import OrderRepository
from app.repositories.ticket import TicketRepository
from sqlalchemy.orm import Session


stripe.api_key = os.getenv(
    "STRIPE_SECRET_KEYS",
    "sk_test_51QQtS4BDmkshEb9hkHvrxBNPSbpiD81u5DYh5VyCvMT3OwTKhVXqcD3758tFCjNtbSG5DfYPHxOvXFGoSd9eUsNX001aVtGCcr",
)


def create_stripe_checkout_session(
    amount,
    quantity,
    product_name,
    currency,
    success_url="https://www.booking-ticket.com.com/success",
    cancel_url="https://www.booking-ticket.com.com/cancel",
):
    try:
        # Create a checkout session
        price_in_cents = int(amount * 100)

        tracking_id = uuid.uuid4()

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],  # Specify the payment methods
            line_items=[
                {
                    "price_data": {
                        "currency": currency,
                        "product_data": {
                            "name": product_name,
                        },
                        "unit_amount": price_in_cents,  # Amount in cents
                    },
                    "quantity": quantity,
                }
            ],
            mode="payment",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "tracking_id": str(tracking_id),
                "this_is_a_test_key": "this_is_a_test_value",
            },
            payment_intent_data={
                "metadata": {
                    "tracking_id": str(tracking_id),
                }
            },
        )
        retrieved_session = stripe.checkout.Session.retrieve(session.id)
        payment_intent_id = retrieved_session.payment_intent

        print(
            f"Stripe Checkout session created: {session.id}, {payment_intent_id}",
            flush=True,
        )

        return session, tracking_id
    except Exception as e:
        raise e


class StripeWebhookService:
    def __init__(self, db: Session):
        self.order_repository = OrderRepository(db)
        self.ticket_repository = TicketRepository(db)

    def handle_payment_intent_succeeded(self, payment_intent_id: str):
        order = self.order_repository.get_order_by_stripe_session_id(payment_intent_id)
        if order:
            self.order_repository.update_order_status(order.id, OrderStatus.COMPLETED)
            self.ticket_repository.update_ticket_status_by_event(
                order.event_id, TicketStatus.SOLD
            )

    def handle_payment_intent_failed(self, payment_intent_id: str):
        order = self.order_repository.get_order_by_stripe_session_id(payment_intent_id)
        if order:
            self.order_repository.update_order_status(order.id, OrderStatus.CANCELLED)
            self.ticket_repository.update_ticket_status_by_event(
                order.event_id, TicketStatus.AVAILABLE
            )
