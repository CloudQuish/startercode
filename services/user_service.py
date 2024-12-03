from fastapi import HTTPException, status
import re
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

# application imports
from schemas.user_schema import UserCreate, UserResp, LoginResponse
from controllers.user_controller import user_control
from utils.security_utils import hash_password, verify_password
from utils.oauth import credential_exception, create_access_token

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_control = user_control(self.db)

    async def create_user(self, user: UserCreate)->UserResp:
        """Create new user

        Args:
            user: (UserCreate): data of new user

        Returns:
            resp: Added user information
        """
        try:
            user.password = await hash_password(user.password.get_secret_value())
            user = user.model_dump(exclude_unset=True)
            created_user = await self.user_control.add_user(user)
            resp = {
                "message": "User created successfully",
                "data": created_user,
                "status": 201
            }
            return resp
        # catches the duplicates and raises the exception
        except IntegrityError as e:
            error_message = e.args[0]
            match = re.search(r"Key \((.*?)\)=", error_message)
            if match:
                violated_key = match.group(1)
                key = violated_key.split(", ")
                if len(key) > 1:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"{key[-1].capitalize()} already exists",
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"{key[0]} already exists",
                    )
                

    async def login_user(self, user: OAuth2PasswordRequestForm)->LoginResponse:
        """Login user

        Args:
            user: (OAuth2PasswordRequestForm): credentials of user

        Returns:
            resp: Access token of logged in user
        """
        db_user = await self.user_control.get_user_by_email(email=user.username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User does not exist"
            )
        # password verification
        check_password = await verify_password(db_user.password, user.password)
        # raise credential error
        if not check_password:
            await credential_exception()
        # create access token
        tokenizer = {"id": str(db_user.id)}
        access_token = await create_access_token(tokenizer)
        resp = {
            "message": "User Logged in Successfully",
            "status": status.HTTP_200_OK,
            "access_token": access_token,
            "token_type": "Bearer"
        }
        return resp
                
user_service = UserService