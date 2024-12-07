from datetime import datetime

from sqlalchemy.orm import Session

from app import models
from app.auth import auth, schemas


def get_user_by_id(db: Session, user_id: int):
    """
    Get user by id
    :param db:
    :param user_id:
    :return:
    """
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    """
    Get user by email
    :param db:
    :param email:
    :return:
    """
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    """
    Create new user
    :param db:
    :param user:
    :return: db_user
    """
    hashed_password = auth.get_password_hash(user.password)
    # db_user = User(**user.model_dump())
    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=hashed_password,
        phone_number=user.phone_number,
        address=user.address,
        is_verified=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


async def update_user(db: Session, user: models.User, user_data: dict):
    """
    Update user. for eg: is_verified=True
    :param db:
    :param user:
    :param user_data:
    :return: updated user
    """
    for key, value in user_data.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user
