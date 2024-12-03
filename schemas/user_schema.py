from pydantic import EmailStr, BaseModel, field_validator, SecretStr

from utils.schema_utils import AbstractModel, ResponseModel

class UserCreate(AbstractModel):
    name: str
    email: EmailStr
    phone: str
    password: SecretStr

    # Custom field validator to trim leading and trailing spaces
    @field_validator('name', 'email', 'phone', 'password', mode='before')
    def trim_and_check_empty(cls, v, field):
        trimmed_value = v.strip() or None  # Trim whitespace
        if not trimmed_value:  # Check if the field is empty after trimming
            raise ValueError(f'{field.field_name} cannot be empty')
        return trimmed_value

    @field_validator('phone')
    @classmethod
    def phone_length(cls, v:str):
        if len(v) != 10:
            raise ValueError("Phone number must be of 10 digits")
        return v

class UserDetails(AbstractModel):
    id: int
    name: str
    email: EmailStr
    phone: str

class UserResp(ResponseModel):
    data: UserDetails

# Email DTO (Used for token verification)
class TokenData(AbstractModel):
    id: str

class LoginResponse(ResponseModel):
    access_token: str
    token_type: str = "Bearer"