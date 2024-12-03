from sqlalchemy import (
    Column,
    String,
    Boolean,
    text,
)
from sqlalchemy.orm import relationship
from utils.model_utils import AbstractModels

class Users(AbstractModels):
    __tablename__ = "users"

    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    phone = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False, server_default=text("False"))
    orders = relationship("Orders", back_populates="user", cascade="all,delete-orphan")