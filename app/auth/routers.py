import os
from datetime import timedelta
from typing import List

from dotenv import load_dotenv
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse

from app import models
from app.auth import auth, schemas
from app.auth.auth import blacklist_token, create_url_safe_token, decode_url_safe_token, get_current_verified_user, get_password_hash, verify_password
from app.auth.get_create_user import create_user, get_user_by_email, update_user
from app.auth.schemas import CreateUserResponseMessage, EmailSchema, ForgotPasswordConfirmModel, ForgotPasswordRequestModel, LoginData, PasswordResetConfirmModel, PasswordResetRequestModel
from app.celery_tasks import send_email_celery
from app.custom_exception import IncorrectCurrentPassword, IncorrectEmailPassword, PasswordDidNotMatch, UserAlreadyExists, UserNotFound
from app.db_connection import get_db

load_dotenv()

auth_router = APIRouter(tags=["auth"])


@auth_router.post('/send_email/')
async def send_email(email: EmailSchema, background_tasks: BackgroundTasks):
    """
    Sends email.
    :param email: email
    :param background_tasks:
    :return: JSONResponse
    """
    subject = "Welcome To TicketBooking"
    # background_tasks.add_task(send_email_async, email.addresses, "Welcome to AcciGuard",
    #                           template_name="verification_email.html", template_data={
    #                             "message": "Hello",
    #                         })
    send_email_celery.delay(addresses=email.addresses, subject=subject, template_name="verification_email.html",
                            template_data={
                                "user_email": "user.email",
                                "verification_link": "verification_link"
                            })
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Email has been sent 👍🙋🤣🙋"})


@auth_router.get('/verify/{token}/')
async def verify_user_account(token: str, db: Session = Depends(get_db)):
    """
    Get User Information like email after verification and update user information.
    :param token: token
    :param db: Database Session
    :return: JSONResponse
    """
    token_data = decode_url_safe_token(token)
    user_email = token_data.get('email', None)
    if user_email:
        user = get_user_by_email(db, user_email)
        if not user:
            raise UserNotFound
        await update_user(db, user, {'is_verified': True})
        return JSONResponse(status_code=status.HTTP_200_OK, content={'message': 'User successfully verified 👍🤣.'})
    return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={'message': 'Invalid token 👿👿.'})


@auth_router.post("/create_users/", response_model=schemas.CreateUserResponseMessage)
async def create_users(user: schemas.UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Creates and verifies users.
    :param user: email, password, address, phone_number, role, password
    :param background_tasks:
    :param db: Database Session
    :return: new_user
    """
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise UserAlreadyExists
    new_user = create_user(db, user)
    domain = os.environ.get('DOMAIN')
    token = create_url_safe_token({"email": user.email})
    verification_link = f"http://{domain}/api/v1/auth/verify/{token}/"
    send_email_celery.delay(
        addresses=[user.email],
        subject="Verify Account",
        template_name="verification_email.html",
        template_data={
            "user_email": user.email,
            "verification_link": verification_link
        }
    )
    return CreateUserResponseMessage(user=new_user)


@auth_router.post("/token/refresh/", response_model=schemas.TokenResponse)
async def refresh_access_token(token: str, db: Session = Depends(get_db)):
    """
    This function generates access_token using refresh token and users don't have to use their credentials.
    :param token: refresh_token
    :param db: Database Session
    :return: new access token, refresh_token, token_type
    """
    token_data = auth.verify_refresh_token(token)
    user = get_user_by_email(db, token_data.get('email'))
    if not user:
        raise UserNotFound
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    refresh_token = auth.create_refresh_token(data={"sub": user.email})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "Bearer"}


@auth_router.post("/token/", response_model=schemas.Token)
async def login_for_access_token(form_data: LoginData, db: Session = Depends(get_db)):
    """
    It generates access token, refresh token after login
    :param form_data: User Email and Password
    :param db: Database Session
    :return: access_token, refresh_token, token_type
    """
    user = auth.authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise IncorrectEmailPassword
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    refresh_token = auth.create_refresh_token(data={"sub": user.email})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@auth_router.get("/users/me/", response_model=schemas.UserResponse)
async def read_users_me(current_user: schemas.UserResponse = Depends(get_current_verified_user),):
    """
    Current Verified Logged-In Users
    :param current_user: Currently logged-in verified user
    :return: current user
    """
    return current_user


@auth_router.get('/all_users/', response_model=List[schemas.UserResponse])
async def read_all_users(db: Session = Depends(get_db),):
    """
    Get All Verified Users
    :param _: Only Admin is allowed to see all users
    :param db: Database Session
    :return: All Verified Users
    """
    all_users = db.query(models.User).filter(models.User.is_verified == True).all()
    if not all_users:
        raise UserNotFound
    return all_users


@auth_router.post('/password-reset/')
async def password_reset(request_data: PasswordResetRequestModel, db: Session = Depends(get_db)):
    """
    Initiates the reset password process by sending a reset link to the user's email
    :param request_data: Contains the user's email
    :param db: Database session
    :return: JSON response indicating email sent status
    """
    user = get_user_by_email(db, request_data.email)
    if not user:
        raise UserNotFound
    email = request_data.email
    domain = os.environ.get('DOMAIN')
    token = create_url_safe_token({"email": email})
    link = f"http://{domain}/api/v1/auth/password-reset-confirm/{token}/"
    send_email_celery.delay(
        addresses=[email],
        subject="Reset Password",
        template_name="password_reset.html",
        template_data={
            "user_email": email,
            "verification_link": link
        }
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Password reset email sent 👍🙋"})


@auth_router.get('/password-reset-confirm/{token}/')
async def confirm_password_reset(token: str, password_data: PasswordResetConfirmModel, db: Session = Depends(get_db)):
    """
    Update the user's password using the reset password token
    :param password_data: Current and new password data
    :param token: Reset token from email
    :param db: Database session
    :return: JSON response indicating reset password status
    """
    PasswordResetConfirmModel.password_validator(password_data.new_password)
    token_data = decode_url_safe_token(token)
    user_email = token_data.get("email", None)
    if user_email:
        user = get_user_by_email(db, user_email)
        if not user:
            raise UserNotFound
        if not verify_password(password_data.current_password, user.password):
            raise IncorrectCurrentPassword
        await update_user(db, user, {'password': get_password_hash(password_data.new_password)})
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Password updated successfully 👍🔥"})
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "An error occurred while password reset 👿⚠️"})


@auth_router.post('/forgot-password/')
async def request_forgot_password(request_data: ForgotPasswordRequestModel, db: Session = Depends(get_db)):
    """
    Initiates the forgot password process by sending a reset link to the user's email
    :param request_data: Contains the user's email
    :param db: Database session
    :return: JSON response indicating email sent status
    """
    user = get_user_by_email(db, email=request_data.email)
    if not user:
        raise UserNotFound
    token = create_url_safe_token({"email": request_data.email})
    domain = os.environ.get('DOMAIN')
    forgot_password_link = f"http://{domain}/api/v1/auth/forgot-password-confirm/{token}/"
    send_email_celery.delay(
        addresses=[user.email],
        subject="Forgot Password",
        template_name="password_reset.html",
        template_data={
            "user_email": user.email,
            "verification_link": forgot_password_link
        }
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Forgot password email sent 👍🙋"})


@auth_router.get('/forgot-password-confirm/{token}/')
async def confirm_forgot_password(token: str, reset_data: ForgotPasswordConfirmModel, db: Session = Depends(get_db)):
    """
    Update the user's password using the forgot password token
    :param token:
    :param reset_data: New Password
    :param db: Database Session
    :return: JSON response indicating forgot password status
    """
    try:
        reset_data.validate_passwords_match()
        ForgotPasswordConfirmModel.password_validator(reset_data.new_password)
        token_data = decode_url_safe_token(token)
        user_email = token_data.get("email", None)
        if user_email:
            user = get_user_by_email(db, user_email)
            if not user:
                raise UserNotFound
            await update_user(db, user, {'password': get_password_hash(reset_data.new_password)})
            return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Password updated successfully 👍🔥"})
    except PasswordDidNotMatch:
        raise PasswordDidNotMatch
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@auth_router.post("/logout/")
async def logout(current_user: schemas.UserResponse = Depends(auth.get_current_user), token: str = Depends(auth.oauth2_scheme),
                 db: Session = Depends(get_db)):
    blacklist_token(db, token)
    return {"message": "Successfully logged out 👍🙂"}
