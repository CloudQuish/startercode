from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class EventBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100, description="Name of the event")
    description: Optional[str] = Field(None, max_length=500, description="Description of the event")
    venue: str = Field(..., min_length=3, max_length=100, description="Venue of the event")
    price: int = Field(..., gt=0, description="Price of the event in cents")
    date: str = Field(..., description="Date of the event")
    total_tickets: int = Field(..., gt=0, description="Total number of tickets available")

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    name: Optional[str] = None
    venue: Optional[str] = None
    price: Optional[int] = None
    date: Optional[str] = None
    total_tickets: Optional[int] = None

class EventResponse(EventBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
