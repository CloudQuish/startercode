from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy import Index


class OrderStatus(enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    stripe_session_id = Column(String, nullable=True)
    user = relationship("User", back_populates="orders")
    event = relationship("Event", back_populates="orders")
    order_tickets = relationship("OrderTicket", back_populates="order")
    created_at = Column(DateTime)


class OrderTicket(Base):
    __tablename__ = "order_tickets"

    order_id = Column(UUID, ForeignKey("orders.id"), primary_key=True)
    ticket_id = Column(UUID, ForeignKey("tickets.id"), primary_key=True)
    order = relationship("Order", back_populates="order_tickets")
    ticket = relationship("Ticket", back_populates="order_tickets")

    # Add index for performance
    __table_args__ = (Index("idx_order_ticket", "order_id", "ticket_id"),)
