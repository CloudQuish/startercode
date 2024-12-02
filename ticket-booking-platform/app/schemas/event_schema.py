from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class EventUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    date: Optional[datetime]
    venue: Optional[str]
    price: Optional[float]
    total_tickets: Optional[int]  # Total tickets is optional for updates

    class Config:
        orm_mode = True  # Allows compatibility with ORM models


class EventCreate(BaseModel):
    name: str
    description: str = None
    date: datetime
    venue: str
    price: float
    total_tickets: int

    class Config:
        orm_mode = True  # Allows compatibility with ORM models
