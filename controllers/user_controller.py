from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import EmailStr

from models.user_model import Users


class UserController:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def add_user(self, user: dict):
        """Add new user into databse

        Args:
            user (dict): User's data
            
        Returns:
            _type_: user
        """
        user = Users(**user)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def get_user_by_email(self, email: EmailStr):
        """Query user's details from db by email:

        Args:
            email (EmailStr): User's email
            
        Returns:
            _type_: user
        """
        stmt = (
            select(Users)
            .where(Users.email == email)
        )
        result = await self.db.execute(stmt)
        user = result.scalar_one_or_none()  # Fetch a single result or None
        return user
    
    async def get_user_by_id(self, id: int):
        """Query user's details from db by id

        Args:
            id (int): User's id
            
        Returns:
            _type_: user
        """
        stmt = (
            select(Users)
            .where(Users.id == id)
        )
        result = await self.db.execute(stmt)
        user = result.scalar_one_or_none()  # Fetch a single result or None
        return user
    
user_control = UserController