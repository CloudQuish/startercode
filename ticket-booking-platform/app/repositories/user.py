from sqlalchemy.orm import Session
from sqlalchemy.future import select
from app.schemas.user_schema import UserCreate, UserUpdate
from app.models.user import User
from datetime import datetime, timezone
from uuid import UUID
from pydantic import BaseModel
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, status, Depends
from app.core.config import settings  # Create this settings module


class UserSqlRepository:
    SECRET_KEY = settings.JWT_SECRET_KEY  # Store the secret key in a configuration file
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

    REFRESH_TOKEN_EXPIRE_DAYS = 7

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

    def create_access_token(self, user_id: str) -> str:
        expire = datetime.utcnow() + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {"sub": user_id, "exp": expire}
        return jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)

    def create_refresh_token(self, user_id: str) -> str:
        expire = datetime.utcnow() + timedelta(days=self.REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode = {"sub": user_id, "exp": expire, "type": "refresh"}
        return jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)

    def decode_token(self, token: str, expected_type: str = "access"):
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            user_id: str = payload.get("sub")
            token_type: str = payload.get("type", "access")
            if user_id is None or token_type != expected_type:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token.",
                )
            return user_id
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired.",
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
            )
