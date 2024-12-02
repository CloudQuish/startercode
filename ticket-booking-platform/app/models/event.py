import uuid
from sqlalchemy import Column, String, DateTime, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid


class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    date = Column(DateTime, nullable=False)
    venue = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    total_tickets = Column(Integer, nullable=False)

    tickets = relationship("Ticket", back_populates="event")
    orders = relationship("Order", back_populates="event")
