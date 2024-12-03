from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from core.config import db_settings

db_user=db_settings.DATABASE_USER
db_pwd=db_settings.DATABASE_PASSWORD
db_host=db_settings.DATABASE_HOST
db_port=db_settings.DATABASE_PORT
db_name=db_settings.DATABASE_NAME

DATABASE_URL = f"postgresql+asyncpg://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}"

# Create asynchronous engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Create async sessionmaker
session = sessionmaker(
    engine, class_=AsyncSession, autocommit=False, autoflush=False
)

# Create base class for models
Base = declarative_base()
