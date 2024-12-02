from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from app.api.route_handlers import (
    EventView,
    UserView,
    BookingView,
    StripeWebhookView,
)
from app.core.database import get_db


router = APIRouter()

# Route for listing events with pagination
router.add_api_route(
    path="/events/",
    endpoint=EventView.list_events,
    methods=["GET"],
    tags=["Event Management"],
    summary="List all events with pagination",
    description="Retrieve a paginated list of events, providing page number and size.",
)


# Event Management Routes
router.add_api_route(
    path="/events/",
    endpoint=EventView.create_event,
    methods=["POST"],
    tags=["Event Management"],
    summary="Create or update event details",
    description="Create or update events with details like name, description, date, venue, ticket price, and total tickets available.",
)

router.add_api_route(
    path="/events/{event_id}/book/",
    endpoint=BookingView.book_ticket,
    methods=["POST"],
    tags=["Ticket Booking"],
    summary="Book tickets for an event",
    description=(
        "Locks tickets to prevent overselling and returns a Stripe payment session "
        "link or client secret for completing the payment."
    ),
)


# User Management Routes

# Route for listing users with pagination
router.add_api_route(
    path="/users/",
    endpoint=UserView.list_users,
    methods=["GET"],
    tags=["User Management"],
    summary="List all users with pagination",
    description="Retrieve a paginated list of users, providing page number and size.",
)


router.add_api_route(
    path="/users/",
    endpoint=UserView.create_user,
    methods=["POST"],
    tags=["User Management"],
    summary="Create a new user",
    description="Create a new user with a username, email, and password.",
)

router.add_api_route(
    path="/users/{user_id}/",
    endpoint=UserView.update_user,
    methods=["PUT"],
    tags=["User Management"],
    summary="Update user details",
    description="Update an existing user's username, email, or password.",
)


router.add_api_route(
    path="/webhook/payment/",
    endpoint=StripeWebhookView.handle_payment_webhook,
    methods=["POST"],
    tags=["Payment Processing"],
    summary="Stripe webhook handler",
    description="Handle Stripe webhook events to confirm or fail payment.",
)
