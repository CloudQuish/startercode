from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum
from sqlalchemy.dialects.postgresql import UUID
import uuid


class TicketStatus(enum.Enum):
    AVAILABLE = "AVAILABLE"
    LOCKED = "LOCKED"
    SOLD = "SOLD"


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.AVAILABLE)

    event = relationship("Event", back_populates="tickets")

    order_tickets = relationship("OrderTicket", back_populates="ticket")
