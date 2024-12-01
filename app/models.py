import datetime

from sqlalchemy import TIMESTAMP, BigInteger, Boolean, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.db_connection import Base
from app.enums import TicketStatus


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    phone_number = Column(BigInteger, unique=True)
    address = Column(String)
    is_verified = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"{self.email}"


class BlacklistedToken(Base):
    __tablename__ = "blacklisted_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True)
    blacklisted_on = Column(DateTime, default=datetime.datetime.utcnow)


class Events(Base):
    __tablename__ = 'events'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    venue = Column(String)
    price = Column(Integer)
    date = Column(String)
    total_tickets = Column(Integer)
    created_at = Column(TIMESTAMP, default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"{self.name}"


class Tickets(Base):
    __tablename__ = 'tickets'
    id = Column(Integer, primary_key=True, index=True)
    number_of_tickets = Column(Integer)
    event_id = Column(Integer, ForeignKey('events.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    status = Column(String, default=TicketStatus.AVAILABLE.value)
    created_at = Column(TIMESTAMP, default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, default=func.now(), onupdate=func.now(), nullable=False)

    event = relationship("Events", back_populates="tickets")
