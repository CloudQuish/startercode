from sqlalchemy import TIMESTAMP, BigInteger, Boolean, Column, Integer, String, func

from app.db_connection import Base


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    phone_number = Column(BigInteger, unique=True)
    address = Column(String)
    is_verified = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"{self.email}"
