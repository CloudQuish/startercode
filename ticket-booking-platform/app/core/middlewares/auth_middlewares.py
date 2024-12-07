from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.repositories.user import UserSqlRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        token = None
        try:
            # Extract token from the Authorization header
            token = await oauth2_scheme(request)
        except Exception:
            pass

        if token:
            db: Session = next(get_db())  # Get a DB session
            user_repo = UserSqlRepository(db)

            try:
                # Decode and validate the token
                user_id = user_repo.decode_token(token)
                user = user_repo.get_user(user_id)
                if user:
                    # Attach the user object to the request
                    request.state.user = user
            except HTTPException:
                pass

        # Proceed with the next middleware or endpoint
        response = await call_next(request)
        return response
