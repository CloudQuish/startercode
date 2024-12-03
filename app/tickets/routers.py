from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette import status

from app.auth import schemas, auth
from app.custom_exception import ErrorBookingTicket, EventNotFound, NoTicketsAvailable, TicketNotFound, TicketsAlreadyBooked
from app.db_connection import get_db
from app.enums import TicketStatus
from app.models import Events, Tickets
from app.tickets.schemas import TicketCreate, TicketResponse

tickets_router = APIRouter(tags=["tickets"])


@tickets_router.post("/book/", response_model=TicketResponse)
def book_ticket(
    ticket_data: TicketCreate,
    number_of_tickets: int = Query(1, gt=0, le=10),
    current_user: schemas.UserResponse = Depends(auth.get_current_verified_user),
    db: Session = Depends(get_db)
):
    """
    Book tickets for an event

    - Requires logged-in and verified user
    - Checks event availability
    - Creates tickets for the user
    - Manages ticket inventory
    - Supports multiple ticket purchase
    """
    # Fetch the event
    event = db.query(Events).filter(Events.id == ticket_data.event_id).first()
    if not event:
        raise EventNotFound

    # Check if enough tickets are available
    booked_tickets = db.query(Tickets).filter(
        Tickets.event_id == ticket_data.event_id,
        Tickets.status == TicketStatus.BOOKED.value
    ).count()

    if booked_tickets + number_of_tickets > event.total_tickets:
        raise NoTicketsAvailable

    # Check if user has already booked tickets for this event
    existing_tickets = db.query(Tickets).filter(
        Tickets.event_id == ticket_data.event_id,
        Tickets.user_id == current_user.id,  # Use current user's ID
        Tickets.status == TicketStatus.BOOKED.value
    ).count()

    if existing_tickets > 0:
        raise TicketsAlreadyBooked

    try:
        # Create multiple tickets
        new_tickets = [
            Tickets(
                event_id=ticket_data.event_id,
                user_id=current_user.id,  # Use current user's ID
                number_of_tickets=number_of_tickets,
                status=TicketStatus.BOOKED.value
            ) for _ in range(number_of_tickets)
        ]

        db.add_all(new_tickets)
        db.commit()

        # Refresh each ticket
        for ticket in new_tickets:
            db.refresh(ticket)

        # Return the first ticket (or could create a custom response)
        return new_tickets[0]

    except Exception:
        db.rollback()
        raise ErrorBookingTicket


@tickets_router.delete("/{ticket_id}/cancel/", status_code=204)
def cancel_ticket(
    ticket_id: int,
    current_user: schemas.UserResponse = Depends(auth.get_current_verified_user),
    db: Session = Depends(get_db)
):
    """
    Cancel booked tickets

    - Requires logged-in and verified user
    - Validates ticket ownership
    - Updates ticket status
    - Allows cancellation of multi-ticket bookings
    """
    # Fetch tickets for this booking
    tickets = db.query(Tickets).filter(
        Tickets.id == ticket_id,
        Tickets.user_id == current_user.id,  # Use current user's ID
        Tickets.status == TicketStatus.BOOKED.value
    ).all()

    if not tickets:
        raise TicketNotFound

    try:
        # Update status of all related tickets
        for ticket in tickets:
            ticket.status = TicketStatus.CANCELLED.value

        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error cancelling tickets: {str(e)}")


@tickets_router.get("/list/", response_model=List[TicketResponse])
def list_user_tickets(
    current_user: schemas.UserResponse = Depends(auth.get_current_verified_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve tickets for the current logged-in user

    - List booked tickets
    - Shows total number of tickets purchased
    """
    tickets = db.query(Tickets).filter(
        Tickets.user_id == current_user.id,
        Tickets.status == TicketStatus.BOOKED.value
    ).all()

    return tickets


@tickets_router.get("/events/{event_id}/tickets/", response_model=List[TicketResponse])
def get_event_tickets(
    event_id: int,
    current_user: schemas.UserResponse = Depends(auth.get_current_verified_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve tickets for a specific event for the current user

    - Requires logged-in and verified user
    - List booked tickets
    - Show ticket inventory
    """
    # Verify event exists
    event = db.query(Events).filter(Events.id == event_id).first()
    if not event:
        raise EventNotFound

    # Get booked tickets for the event
    tickets = db.query(Tickets).filter(
        Tickets.event_id == event_id,
        Tickets.user_id == current_user.id,
        Tickets.status == TicketStatus.BOOKED.value
    ).all()

    return tickets


@tickets_router.get("/stats/", response_model=Dict[str, int])
def get_event_ticket_stats(
    event_id: int,
    current_user: schemas.UserResponse = Depends(auth.get_current_verified_user),
    db: Session = Depends(get_db)
) -> Dict[str, int]:
    """
    Get ticket statistics for an event

    - Requires logged-in and verified user
    - Total tickets
    - Booked tickets
    - Available tickets
    - Total tickets purchased
    """
    event = db.query(Events).filter(Events.id == event_id).first()
    if not event:
        raise EventNotFound

    total_tickets = event.total_tickets

    # Sum of all booked tickets
    booked_tickets_query = db.query(func.sum(Tickets.number_of_tickets)).filter(
        Tickets.event_id == event_id,
        Tickets.status == TicketStatus.BOOKED.value
    ).scalar() or 0

    return {
        "total_tickets": total_tickets,
        "booked_tickets": booked_tickets_query,
        "available_tickets": total_tickets - booked_tickets_query
    }
