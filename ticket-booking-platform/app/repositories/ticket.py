from sqlalchemy.orm import Session
from sqlalchemy import select, update, insert, and_, or_
from uuid import UUID
from app.models.ticket import Ticket, TicketStatus
from app.models.order import Order, OrderStatus
from typing import List
import logging


class TicketRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_available_tickets(self, event_id: UUID) -> List[Ticket]:
        """
        Fetch available tickets for a specific event.

        Args:
            event_id (UUID): The ID of the event.

        Returns:
            List[Ticket]: A list of available tickets.
        """
        try:
            query = select(Ticket).where(
                and_(
                    Ticket.event_id == event_id,
                    or_(
                        Ticket.status == TicketStatus.AVAILABLE,
                        Ticket.status == TicketStatus.LOCKED,
                    ),
                )
            )
            result = self.db.execute(query)
            tickets = result.scalars().all()
            logging.info(
                f"Retrieved {len(tickets)} available tickets for event {event_id}."
            )
            return tickets
        except Exception as e:
            logging.exception(
                f"Error fetching available tickets for event {event_id}: {e}"
            )
            return []  # Return an empty list on error

    def lock_tickets(self, ticket_ids: list[UUID]):
        """Lock tickets by updating their status."""
        for ticket_id in ticket_ids:
            query = (
                update(Ticket)
                .where(Ticket.id == ticket_id)
                .values(status=TicketStatus.LOCKED)
            )
            self.db.execute(query)
        self.db.commit()  # Commit the transaction

    def release_tickets(self, ticket_ids: list[UUID]):
        """Release tickets by updating their status to 'Available'."""
        for ticket_id in ticket_ids:
            query = (
                update(Ticket)
                .where(Ticket.id == ticket_id)
                .values(status=TicketStatus.AVAILABLE)
            )
            self.db.execute(query)
        self.db.commit()  # Commit the transaction

    def create_ticket(
        self,
        event_id: UUID,
    ):
        """Create a new ticket for an event."""
        query = insert(Ticket).values(
            event_id=event_id,
            status=TicketStatus.AVAILABLE,  # New tickets are available by default
        )
        self.db.execute(query)
        self.db.commit()  # Commit the transaction

    def get_ticket_status(self, ticket_id: UUID):
        """Get the current status of a ticket."""
        query = select(Ticket).where(Ticket.id == ticket_id)
        result = self.db.execute(query)
        return (
            result.scalar_one_or_none()
        )  # Returns a single ticket or None if not found

    def update_ticket_status(self, ticket_id: UUID, status: TicketStatus):
        """Update the status of a ticket."""
        query = update(Ticket).where(Ticket.id == ticket_id).values(status=status)
        self.db.execute(query)
        self.db.commit()

    def update_ticket_status_by_event(self, event_id: UUID, status: TicketStatus):
        self.db.query(Ticket).filter(Ticket.event_id == event_id).update(
            {"status": status}
        )
        self.db.commit()

    def get_ticket_ids_by_order(self, order_id: UUID):
        """Fetch ticket IDs associated with a specific order."""
        try:
            # Get the event_id from the order
            order_query = select(Order.event_id).where(Order.id == order_id)
            order_result = self.db.execute(order_query)
            order = order_result.scalar_one_or_none()

            if not order:
                return []  # Return an empty list if the order doesn't exist

            # Now that we have the event_id, fetch the ticket IDs for that event
            event_id = order
            ticket_query = select(Ticket.id).where(Ticket.event_id == event_id)
            ticket_result = self.db.execute(ticket_query)
            return [
                ticket_id for (ticket_id,) in ticket_result.fetchall()
            ]  # Fetch and return list of ticket IDs

        except Exception as e:
            # Log the exception or handle it as needed
            print(f"Error fetching ticket IDs for order {order_id}: {e}")
            return []
