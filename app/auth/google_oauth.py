import os
from datetime import timedelta
from urllib.parse import urlencode

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse

from app.auth.auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, create_refresh_token
from app.custom_exception import UserAlreadyExists
from app.db_connection import get_db
from app.models import User

load_dotenv()

mode = os.environ.get("MODE")

google_oauth_router = APIRouter(tags=["google_oauth"])


@google_oauth_router.get("/google/signin/")
async def google_signin():
    """
    Initiates the Google OAuth2 flow by redirecting to Google's consent screen
    """
    GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"

    # Get these from your Google Cloud Console
    CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
    if mode == 'development':
        REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI")
    elif mode == 'production':
        REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI_PROD")
    else:
        REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI")

    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }

    authorization_url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"

    # return RedirectResponse(authorization_url)
    return JSONResponse({"url": authorization_url})


async def get_google_user_info(access_token: str) -> dict:
    """
    Fetches user information from Google's userinfo endpoint
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get user info from Google")
        return response.json()


async def get_or_create_google_oauth_user(db: Session, user_info: dict) -> User:
    """
    Retrieves existing user or creates a new one based on Google profile
    """
    email = user_info.get('email')
    user = db.query(User).filter(User.email == email).first()
    if not user:

        user = User(
            first_name=user_info.get('given_name'),
            last_name=user_info.get('family_name'),
            email=email,
            is_verified=True,
            phone_number=0000000000,
            address="",
            password=""
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        return user
    else:
        raise UserAlreadyExists()


@google_oauth_router.get("/google/callback/")
async def google_callback(code: str, db: Session = Depends(get_db)):
    """
        Handles the OAuth2 callback from Google:
        1. Exchanges authorization code for tokens
        2. Gets user info from Google
        3. Creates or retrieves user
        4. Generates application tokens
        """
    try:
        google_redirect_uri_local = os.environ.get("GOOGLE_REDIRECT_URI")
        google_redirect_uri_prod = os.environ.get("GOOGLE_REDIRECT_URI_PROD")
        if mode == 'development':
            redirect_uri = google_redirect_uri_local
        elif mode == 'production':
            redirect_uri = google_redirect_uri_prod
        else:
            redirect_uri = google_redirect_uri_local
        token_url = "https://oauth2.googleapis.com/token"
        token_params = {
            "client_id": os.environ.get("GOOGLE_CLIENT_ID"),
            "client_secret": os.environ.get("GOOGLE_CLIENT_SECRET"),
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri
        }

        async with httpx.AsyncClient() as client:
            token_response = await client.post(token_url, data=token_params)
            if token_response.status_code != 200:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get tokens from Google")

            tokens = token_response.json()
            google_access_token = tokens.get('access_token')

        user_info = await get_google_user_info(google_access_token)

        try:
            user = await get_or_create_google_oauth_user(db, user_info)
        except UserAlreadyExists:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "message": "User already exists ⛔👿",
                    "error-code": "user-already-exists",
                }
            )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        tokens = {
            "access_token": create_access_token({"sub": user.email}, expires_delta=access_token_expires),
            "refresh_token": create_refresh_token({"sub": user.email}),
            "token_type": "Bearer",
        }
        # If you want to redirect back to frontend with tokens
        # frontend_url = os.environ.get("FRONTEND_URL")
        # redirect_url = f"{frontend_url}/auth/callback?{urlencode(tokens)}"
        # return RedirectResponse(url=redirect_url)
        response_data = {
            "user": {
                "id": user.id,
                "email": user.email,
                "is_verified": user.is_verified,
            },
            "user_info": user_info,
            "tokens": tokens,
            "message": "Success"
        }

        return JSONResponse(content=response_data)

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# @google_oauth_router.put("/complete-profile/")
# async def complete_user_profile(profile_data: UpdateUserProfileGoogleSignIn,
#                                 current_user: User = Depends(get_current_verified_user),
#                                 db: Session = Depends(get_db)):
#     if not current_user:
#         raise UserNotFound
#     update_data = profile_data.dict(exclude_unset=True)
#     if update_data:
#         await update_user(db, current_user, update_data)
#     return current_user
