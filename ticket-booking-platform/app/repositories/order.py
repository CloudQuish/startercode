from sqlalchemy.orm import Session
from sqlalchemy import select, update, insert, delete
from uuid import UUID
import logging
from app.models.order import Order, OrderStatus, OrderTicket
from sqlalchemy.dialects.postgresql import insert

logger = logging.getLogger(__name__)


class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_order(
        self, user_id: UUID, event_id: UUID, stripe_session_id: str = None
    ) -> Order:
        """Create a new order."""
        order = Order(
            user_id=user_id,
            event_id=event_id,
            stripe_session_id=stripe_session_id,
        )
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)
        logger.info(
            f"Order created: {order.id} for user {user_id} and event {event_id}."
        )
        return order

    def get_order_by_id(self, order_id: UUID) -> Order:
        """Retrieve an order by its ID."""
        query = select(Order).where(Order.id == order_id)
        result = self.db.execute(query)
        order = result.scalar_one_or_none()
        if order:
            logger.info(f"Order retrieved: {order.id}.")
        else:
            logger.warning(f"Order not found: {order_id}.")
        return order

    def update_order_status(self, order_id: UUID, status: str) -> Order:
        """Update the status of an order."""
        query = update(Order).where(Order.id == order_id).values(status=status)
        self.db.execute(query)
        self.db.commit()
        logger.info(f"Order status updated: {order_id} to {status}.")
        return self.get_order_by_id(order_id)  # Return the updated order

    def get_orders_by_user_id(self, user_id: UUID):
        """Retrieve all orders for a specific user."""
        query = select(Order).where(Order.user_id == user_id)
        result = self.db.execute(query)
        orders = result.scalars().all()
        logger.info(f"Retrieved {len(orders)} orders for user {user_id}.")
        return orders

    def get_orders_by_event_id(self, event_id: UUID):
        """Retrieve all orders for a specific event."""
        query = select(Order).where(Order.event_id == event_id)
        result = self.db.execute(query)
        orders = result.scalars().all()
        logger.info(f"Retrieved {len(orders)} orders for event {event_id}.")
        return orders

    def get_order_by_stripe_session_id(self, stripe_session_id: str) -> Order:
        return (
            self.db.query(Order)
            .filter(Order.stripe_session_id == stripe_session_id)
            .first()
        )

    def create_tickets_for_order(self, order_id: UUID, ticket_ids: list[UUID]):
        """Create order-ticket associations in bulk."""
        order_tickets = [
            {"order_id": order_id, "ticket_id": ticket_id} for ticket_id in ticket_ids
        ]
        self.db.execute(insert(OrderTicket).values(order_tickets))
        self.db.commit()
        for i in range(len(ticket_ids)):
            logger.info(
                f"Created order-ticket association for order {order_id} and ticket {ticket_ids[i]}."
            )
        logger.info(f"Created {len(ticket_ids)} order-ticket associations in bulk.")
        return True

    def get_tickets_for_order(self, order_id: UUID):
        """Retrieve ticket IDs directly to avoid unnecessary overhead."""
        query = select(OrderTicket.ticket_id).where(OrderTicket.order_id == order_id)
        result = self.db.execute(query)
        tickets = [row[0] for row in result.fetchall()]
        logger.info(f"Retrieved {len(tickets)} tickets for order {order_id}.")
        return tickets
