from sqlalchemy.orm import Session
from sqlalchemy.future import select
from app.schemas.user_schema import UserCreate, UserUpdate
from app.models.user import User
from datetime import datetime, timezone
from uuid import UUID
from pydantic import BaseModel
from passlib.context import CryptContext


class UserSqlRepository:
    def __init__(self, db: Session):
        self.db = db
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def create_user(self, user_data: UserCreate) -> User:
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=self.hash_password(user_data.password),
            created_at=datetime.now(timezone.utc),
        )
        self.db.add(db_user)
        self.db.commit()  # Commit the transaction
        self.db.refresh(db_user)  # Refresh to get the updated user with ID
        return db_user

    def update_user(self, user_id: UUID, user_data: UserUpdate) -> User:
        db_user = self.db.get(User, user_id)
        if db_user:
            if user_data.username is not None:
                db_user.username = user_data.username
            if user_data.email is not None:
                db_user.email = user_data.email
            if user_data.password is not None:
                db_user.hashed_password = self.hash_password(user_data.password)
            self.db.commit()  # Commit the transaction
            self.db.refresh(db_user)  # Refresh to get updated data
            return db_user
        return None

    def get_user_by_email(self, email: str) -> User:
        stmt = select(User).where(User.email == email)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def get_user(self, user_id: UUID) -> User:
        return self.db.get(User, user_id)

    def get_users(self, page: int, size: int):
        query = self.db.query(User)
        total_users = query.count()
        users = query.offset((page - 1) * size).limit(size).all()  # Pagination logic
        return users, total_users
