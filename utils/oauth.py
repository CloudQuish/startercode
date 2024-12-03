# python import
from datetime import datetime, timedelta

# framework imports
from fastapi import Depends, Header, HTTPException, status
from fastapi.security.oauth2 import OAuth2PasswordBearer

# JWT imports
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

# Apoplication imports
from core.config import auth_settings
from schemas.user_schema import TokenData
from controllers.user_controller import user_control
from utils.db_utils import get_db

# OAUTH Login Endpoint
oauth_schemes = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login/")


# AUTH SECRETS AND TIME LIMITS
access_secret_key = auth_settings.access_secret_key
access_time_exp = auth_settings.access_time_exp
Algorithm = auth_settings.Algorithm


async def create_access_token(data: dict) -> str:
    """
    Generates a JWT token with an expiration date using the given data.
    """
    to_encode = data.copy()
    expire = datetime.now() + timedelta(days=access_time_exp)
    to_encode["exp"] = expire
    encode_jwt = jwt.encode(to_encode, access_secret_key, algorithm=Algorithm)
    return encode_jwt


async def credential_exception():
    """
    Handles and raises authentication failure exceptions.
    """
    raise HTTPException(
        detail="Could not validate credentials",
        status_code=status.HTTP_401_UNAUTHORIZED,
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_user(
    token: str = Depends(oauth_schemes),
    db: AsyncSession = Depends(get_db),
):
    """
    Validates a JWT token, retrieves the user from the database, 
    and returns the user if authenticated.
    """
    try:
        decode_data = jwt.decode(token, access_secret_key, algorithms=Algorithm)
        id = decode_data.get("id")
        if id is None:
           await credential_exception()

        token_data = TokenData(id=id)
    except JWTError:
        await credential_exception()

    user_check = await user_control(db).get_user_by_id(int(token_data.id))

    if not user_check:
        await credential_exception()

    return user_check
