from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import event as event_orm
from fastapi import HTTPException
import uuid


class EventSqlRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_event(self, event_data: dict) -> event_orm.Event:
        event = event_orm.Event(
            id=uuid.uuid4(),  # Generate a new UUID for the event
            name=event_data["name"],
            description=event_data.get("description"),
            date=event_data["date"],
            venue=event_data["venue"],
            price=event_data["price"],
            total_tickets=event_data["total_tickets"],
        )
        self.session.add(event)
        try:
            self.session.commit()
            self.session.refresh(
                event
            )  # Refresh the instance to get the latest data from the database
            return event
        except IntegrityError:
            self.session.rollback()  # Rollback the session on error
            raise HTTPException(
                status_code=400, detail="Event with this name already exists."
            )

    def get_event_by_id(self, event_id: uuid.UUID) -> event_orm.Event:
        event = (
            self.session.query(event_orm.Event)
            .filter(event_orm.Event.id == event_id)
            .first()
        )
        if not event:
            raise HTTPException(status_code=404, detail="Event not found.")
        return event

    def update_event(self, event_id: uuid.UUID, event_data: dict) -> event_orm.Event:
        event = self.get_event_by_id(event_id)
        for key, value in event_data.items():
            setattr(event, key, value)
        self.session.add(event)
        self.session.commit()
        self.session.refresh(event)
        return event

    def delete_event(self, event_id: uuid.UUID) -> dict:
        event = self.get_event_by_id(event_id)
        self.session.delete(event)
        self.session.commit()
        return {"message": "Event deleted successfully."}

    def get_events(self, page: int, size: int):
        query = self.session.query(event_orm.Event)
        total_events = query.count()
        events = query.offset((page - 1) * size).limit(size).all()  # Pagination logic
        return events, total_events
