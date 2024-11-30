alembic init alembic

alembic revision --autogenerate -m "initial"

alembic -n ticketbooking revision --autogenerate -m "initial"

alembic -n ticketbooking upgrade head