from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.custom_exception import EventNotFound
from app.db_connection import get_db
from app.events.schemas import EventCreate, EventResponse, EventUpdate
from app.models import Events

load_dotenv()

events_router = APIRouter(tags=["events"])


@events_router.post("/create/", response_model=EventResponse)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    """
    Create a new event

    - Validates event details
    - Saves event to database
    """
    try:
        created_event = db_event = Events(
            name=event.name,
            description=event.description,
            venue=event.venue,
            price=event.price,
            date=event.date,
            total_tickets=event.total_tickets
        )

        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        return created_event
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@events_router.get("/list/", response_model=List[EventResponse])
def list_events(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=1000), search: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Retrieve list of events

    - Optional pagination
    - Optional search filter
    """

    events = db.query(Events)
    if search:
        # Case-insensitive search across name and description
        events = events.filter(
            func.lower(Events.name).contains(func.lower(search)) |
            func.lower(Events.description).contains(func.lower(search))
        )
    return events


@events_router.get("/{event_id}/", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific event by ID
    """
    event = db.query(Events).filter(Events.id == event_id).first()

    if not event:
        raise EventNotFound

    return event


@events_router.put("/{event_id}/", response_model=EventResponse)
def update_event(event_id: int, event: EventUpdate, db: Session = Depends(get_db)):
    """
    Update an existing event

    - Validates event details
    - Updates event in database
    """
    event_update = db.query(Events).filter(Events.id == event_id).first()
    try:
        # Update only provided fields
        update_data = event_update.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(event, key, value)

        db.commit()
        db.refresh(update_data)

        return update_data

    except Exception as e:
        db.rollback()
        raise ValueError(f"Error updating event: {str(e)}")


@events_router.delete("/{event_id}/", status_code=204)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    """
    Delete an event

    - Removes event from database
    """
    event = db.query(Events).filter(Events.id == event_id).first()

    if not event:
        return False

    try:
        db.delete(event)
        db.commit()
        return True

    except Exception as e:
        db.rollback()
        raise ValueError(f"Error deleting event: {str(e)}")
