from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    username: str = None
    email: EmailStr = None
    password: str = None

    class Config:
        orm_mode = True
