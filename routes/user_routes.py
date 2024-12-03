from fastapi import APIRouter, Depends, status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from utils.db_utils import get_db
from services.user_service import user_service
from schemas.user_schema import UserCreate, UserResp, LoginResponse

user_route=APIRouter(prefix="/api/v1/auth", tags=["Users"])

@user_route.post(
    "/add/user/",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResp
)
async def create_user(
    newUser: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create new user

    Args:
        newUser (UserCreate): User's data
        
    Returns:
        _type_: resp
    """
    resp = await user_service(db).create_user(newUser)
    return resp

@user_route.post(
    "/login/",
    status_code=status.HTTP_200_OK,
    response_model=LoginResponse,
)
async def login(
    cred:OAuth2PasswordRequestForm = Depends(), 
    db:AsyncSession=Depends(get_db)
):
    """Log in the user

    Args:
        cred (OAuth2PasswordRequestForm): User's Credentials like email and password
        
    Returns:
        _type_: resp
    """
    resp = await user_service(db).login_user(cred)
    return resp