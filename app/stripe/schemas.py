from pydantic import BaseModel


class PaymentCreate(BaseModel):
    event_id: int
    number_of_tickets: int
    user_id: int

class PaymentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str