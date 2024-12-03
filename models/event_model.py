from sqlalchemy import (
    Column,
    Float,
    Integer,
    String,
    ForeignKey,
    DateTime,
    text,
    Enum,
    Index,
)
from sqlalchemy.orm import relationship
from utils.model_utils import AbstractModels
from schemas.event_schema import TicketStatus, OrderStatus

class Events(AbstractModels):
    __tablename__ = "events"

    name=Column(String, nullable=False)
    schedule_date=Column(DateTime, nullable=False)
    venue=Column(String, nullable=False)
    price=Column(Integer, nullable=False)
    total_tickets=Column(Integer, nullable=False)
    stripe_price_id=Column(String, nullable=True)
    tickets=relationship("Tickets", back_populates="event", cascade="all,delete-orphan")
    orders=relationship("Orders", back_populates="event")

class Tickets(AbstractModels):
    __tablename__ = "tickets"
    
    status=Column(Enum(TicketStatus), nullable=False, default=TicketStatus.AVAILABLE)
    event_id=Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    event=relationship("Events", back_populates="tickets")

class Orders(AbstractModels):
    __tablename__ = "orders"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"),nullable=False)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    ticket_id = Column(Integer, ForeignKey("tickets.id", ondelete="CASCADE"), nullable=True)
    status = Column(Enum(OrderStatus), nullable=False)
    stripe_session_id = Column(String, nullable=True)
    user=relationship("Users", back_populates="orders")
    event=relationship("Events", back_populates="orders")

    __table_args__ = (
        Index(
            "ix_ticket_status_unique",
            "ticket_id",
            "status",
            unique=True,
            postgresql_where=(status != OrderStatus.FAILED),
        ),
    )