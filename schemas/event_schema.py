from datetime import datetime
from pydantic import Field
from enum import Enum
from typing import List

from utils.schema_utils import AbstractModel, ResponseModel

class TicketStatus(Enum):
    AVAILABLE="available"
    LOCKED="locked"
    SOLD="sold"

# for order status
class OrderStatus(Enum):
    PENDING = "pending"
    CONFIRMED= "confirmed"
    FAILED= "failed"

class EventCreate(AbstractModel):
    name: str
    schedule_date: datetime
    venue: str
    price: float = Field(..., description="Price is in cents(e.g. 2000 for $20)")
    total_tickets: int

class EventDetails(AbstractModel):
    id: int
    name: str
    schedule_date: datetime
    venue: str
    price: int
    total_tickets: int

class EventListsResp(ResponseModel):
    data: List[EventDetails]

class EventResp(ResponseModel):
    data: EventDetails

class CreateCheckoutSession(AbstractModel):
    price_id: str
    quantity: int = 1
    success_url: str
    cancel_url: str

class OrderDetails(AbstractModel):
    event: EventDetails
    ticket_id: int
    status: str

class OrderRep(ResponseModel):
    data: OrderDetails