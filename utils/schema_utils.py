from typing import Optional
from pydantic import BaseModel
from pydantic_settings import BaseSettings

class AbstractSettings(BaseSettings):
    """Settings Models

    Args:
        BaseModel (_type_): Inherits from Pydantic and specifies Config
    """

    class Config:
        env_file = ".env"
        extra= "allow"

class AbstractModel(BaseModel):
    """Schema Models

    Args:
        BaseModel (_type_): Inherits from Pydantic and specifies Config
    """
    
    class Config:
        from_attributes = True
        use_enum_values = True

class ResponseModel(AbstractModel):
    """Base Response Models

    Args:
        BaseModel (_type_): Inherits from Pydantic and specifies Config
    """

    message: str
    status: int