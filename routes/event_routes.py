from fastapi import APIRouter, status, HTTPException, Depends, BackgroundTasks, Request, Header
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional

# application imports
from utils.db_utils import get_db
from schemas.event_schema import (
    EventCreate, 
    EventResp, 
    OrderRep, 
    EventListsResp, 
    TicketListResp,
    OrderListResp,
)
from services.event_service import event_service
from core.config import stripe_settings
from utils.stripe_utils import stripe
from utils.oauth import get_current_user
from permissions.permission_dep import admin_permission_right

event_router = APIRouter(prefix="/api/v1/events", tags=["Events"])

@event_router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=EventResp,
)
async def create_new_event(newEvent: EventCreate, background_tasks: BackgroundTasks,db: AsyncSession=Depends(get_db), current_user = Depends(admin_permission_right)):
    """Create new event
    Args:
        newEvent (EventCreate): Event Descriptions like date, venue, tickets
        background_taks (BackgroundTaks): Background task for creating the tickets assigned for the event
        db (AsyncSession): Async database connection
        current_user (user): Current logged in user with admin rights i.e. to create the events
        
    Returns:
        _type_: resp
    """
    resp = await event_service(db).create_new_event(newEvent, background_tasks)
    return resp

@event_router.get(
        "/{event_id}/",
        status_code=status.HTTP_200_OK,
        response_model=TicketListResp,
)
async def get_event_tickets(event_id: int, current_user=Depends(get_current_user),db: AsyncSession=Depends(get_db)):
    """ Get Tickets List

    Args:
        event_id (int): The ID of event for which ticket is to bought
        current_user (user): Currently logged in user who is booking the ticket,
        db (AsyncSession): Async database connection
        
    Returns:
        _type_: resp
    """
    resp = await event_service(db).get_event_tickets(event_id)
    return resp

@event_router.post(
    "/{event_id}/book/{ticket_id}",
    status_code=status.HTTP_200_OK
)
async def book_event_ticket(event_id: int, ticket_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Book ticket

    Args:
        event_id (int): The ID of event for which ticket is to bought
        ticket_id (int): The ID of ticket that is meant to be bought
        current_user (user): Currently logged in user who is booking the ticket,
        db (AsyncSession): Async database connection
        
    Returns:
        _type_: resp
    """
    resp = await event_service(db).book_ticket(ticket_id=ticket_id, event_id=event_id, user_id = current_user.id)
    return resp

@event_router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Endpoint for stripe to be pinged after the payment processing is done(completed or failed)

    Args:
        request (Request): Request came from the stripe
        db (AsyncSession): Async database connection
        
    Returns:
        _type_: resp
    """
    resp = await event_service(db).stripe_webhook_service(request)
    return resp

@event_router.get(
    "/customer/orders/",
    response_model=OrderListResp,
    status_code=status.HTTP_200_OK
)
async def get_orders_of_user(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    """Get List of current user's orders

    Args:
        db (AsyncSession): Async database connection
        current_user (user): Current logged in user
        
    Returns:
        _type_: resp
    """
    resp = await event_service(db).get_customer_orders(user_id=current_user.id)
    return resp


@event_router.get(
    "/orders/{id}",
    response_model=OrderRep,
    status_code=status.HTTP_200_OK
)
async def get_order_status(id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    """Get status of particular order

    Args:
        id (int): Order id
        db (AsyncSession): Async database connection
        current_user (user): Current logged in user
        
    Returns:
        _type_: resp
    """
    resp = await event_service(db).get_customer_order_by_order_id(order_id=id, user_id=current_user.id)
    return resp

@event_router.get(
    "/",
    response_model=EventListsResp,
    status_code=status.HTTP_200_OK
)
async def get_all_events(db:AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    """Get list of all events

    Args:
        db (AsyncSession): Async database connection
        current_user (user): Current logged in user
        
    Returns:
        _type_: resp
    """
    resp = await event_service(db).get_all_events()
    return resp