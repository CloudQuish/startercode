import stripe

from core.config import stripe_settings

stripe.api_key = stripe_settings.PRIVATE_KEY

async def create_stripe_price(event_name: str, price: float):
    """Function to create the Stripe price for each new events registered"""
    response = stripe.Price.create(
        currency="usd",
        unit_amount_decimal= price,
        product_data={"name":event_name}
    )
    return response.id
