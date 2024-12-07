from pydantic import BaseModel


class TicketCreate(BaseModel):
    event_id: int
    user_id: int
    number_of_tickets: int


class TicketResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    status: str

    class Config:
        from_attributes = True
