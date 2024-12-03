from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

# application imports
from models.event_model import Events, Tickets, Orders
from schemas.event_schema import TicketStatus, OrderStatus

class EventControl:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_new_event(self,event: dict):
        """Inserts the new event data into database"""
        event=Events(**event)
        self.db.add(event)
        await self.db.commit()
        await self.db.refresh(event)
        return event
    
    async def get_event_by_id(self, event_id: int):
        """Queries the db to get Events based on id"""
        stmt = (
            select(Events)
            .where(Events.id == event_id)
        )
        result = await self.db.execute(stmt)
        event = result.scalar_one_or_none()  # Fetch a single result or None
        return event
    
    async def get_all_events(self):
        """Queries the database to get all the events"""
        stmt = (
            select(Events)
        )
        result = await self.db.execute(stmt)
        events = [row[0] for row in result.all()]  # Fetch all
        return events
    
    async def create_bulk_new_tickets(self, tickets: list):
        """
        Function is used to bulk insert tickets at once in db
        
        """
        tickets = [Tickets(**ticket) for ticket in tickets]
        self.db.add_all(tickets)
        await self.db.commit()

    async def get_ticket_by_id_and_event_id(self, ticket_id, event_id):
        """Queries the db to get ticket based on id and event_id"""
        stmt = (
            select(Tickets)
            .where(Tickets.id == ticket_id, Tickets.event_id == event_id)
        )
        result = await self.db.execute(stmt)
        ticket = result.scalar_one_or_none()  # Fetch a single result or None
        return ticket

    async def get_locked_ticket_by_id(self, ticket_id:int):
        """Queries the database for the locked ticket based on id"""
        stmt = (
            select(Tickets)
            .where(Tickets.id == ticket_id, Tickets.status != TicketStatus.SOLD)
        )
        result = await self.db.execute(stmt)
        ticket = result.scalar_one_or_none()  # Fetch a single result or None
        return ticket

    async def get_ticket_by_id(self, ticket_id:int):
        """Queries the db to get Ticktes based on id"""
        ticket = await self.db.get(Tickets,ticket_id)
        return ticket

    async def update_ticket_status(self, ticket: Tickets, status: TicketStatus):
        """Updates the ticket status in database"""
        ticket.status = status
        await self.db.commit()
        await self.db.refresh(ticket)

    async def add_new_order(self, order: dict):
        """Inserts the order details in database"""
        order = Orders(**order)
        self.db.add(order)
        await self.db.commit()
        await self.db.refresh(order)
        return order
    
    async def get_order_by_stripe_session_id(self, session_id: str):
        """Queries the db to get order based on stripe session id"""
        stmt = (
            select(Orders)
            .where(Orders.stripe_session_id == session_id)
        )
        result = await self.db.execute(stmt)
        order = result.scalar_one_or_none()  # Fetch a single result or None
        return order
    
    async def get_order_by_ticket_id(self, ticket_id: str):
        """Queries the database to get the order based on ticket id"""
        stmt = (
            select(Orders)
            .where(Orders.ticket_id == ticket_id, Orders.status == OrderStatus.PENDING)
        )
        result = await self.db.execute(stmt)
        order = result.scalar_one_or_none()  # Fetch a single result or None
        return order
    
    async def get_order_by_order_and_user_id(self, order_id: int, user_id: int):
        """Queries the db to get order based on order id and user id"""
        stmt = (
            select(Orders)
            .where(Orders.id == order_id, Orders.user_id == user_id)
        )
        result = await self.db.execute(stmt)
        order = result.scalar_one_or_none()  # Fetch a single result or None
        return order
    
    async def update_order_status(self, order: Orders, status: OrderStatus):
        """Updates the order in the database"""
        order.status = status
        await self.db.commit()
        await self.db.refresh(order)
        return order
    
event_control = EventControl