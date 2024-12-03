from sqlalchemy import (
    Column,
    Integer,
    TIMESTAMP,
    text,
)
from models.database import Base


class AbstractModels(Base):
    """Base Models

    Args:
        Base (_type_): Inherits Base from SQLAlchemy and specifies columns for inheritance.
    """
    id=Column(Integer, autoincrement=True, nullable=False, unique=True, primary_key=True)
    created_at=Column(TIMESTAMP, server_default=text("NOW()"), onupdate=None)
    updated_at=Column(TIMESTAMP, server_default=text("NOW()"))

    __abstract__ = True