from typing import Any, Callable

from fastapi import FastAPI
from fastapi.requests import Request
from starlette import status
from starlette.responses import JSONResponse

app = FastAPI()


class BaseError(Exception):
    """
    Base exception for all errors
    """
    pass


class InvalidToken(BaseError):
    """
    Error raised when token is invalid
    """
    pass


class UserNotFound(BaseError):
    """
    Error raised when user is not found
    """
    pass


class UserAlreadyExists(BaseError):
    """
    Error raised when user already exists
    """
    pass


class IncorrectEmailPassword(BaseError):
    """
    Error raised when email is incorrect
    """
    pass


class InvalidRefreshToken(BaseError):
    """
    Error raised when refresh token is invalid
    """
    pass


class InvalidCredentials(BaseError):
    """
    Error raised when credentials are invalid
    """
    pass


class TokenBlacklisted(BaseError):
    """
    Error raised when token is blacklisted
    """
    pass


class UserNotVerified(BaseError):
    """
    Error raised when user is not verified
    """
    pass


class NotAuthorized(BaseError):
    """
    Error raised when user is not authorized
    """
    pass


class PasswordDidNotMatch(BaseError):
    """
    Error raised when password did not match
    """
    pass


class IncorrectCurrentPassword(BaseError):
    """
    Error raised when current password is incorrect
    """
    pass


class InvalidGoogleToken(BaseError):
    """
    Error raised when google token is invalid
    """
    pass


class InvalidRedirectUri(BaseError):
    """
    Error raised when redirect uri is invalid
    """
    pass


class EventNotFound(BaseError):
    """
    Error raised when event is not found
    """
    pass


def create_exception_handler(status_code: int, message: Any) -> Callable[[Request, Exception], JSONResponse]:
    """
    This function is used to create a custom exception handler
    :param status_code:
    :param message:
    :return:
    """

    async def exception_handler(request: Request, exc: BaseError) -> JSONResponse:
        return JSONResponse(status_code=status_code, content=message)

    return exception_handler


def register_all_errors(app: FastAPI):
    """
    This function is used to register all custom exception handlers
    :param app:
    :return: error message
    """
    app.add_exception_handler(InvalidToken, create_exception_handler(
        status_code=status.HTTP_403_FORBIDDEN,
        message={
            "message": "Token is invalid ⛔👿.",
            "error-code": "invalid-token",
        }
    ))

    app.add_exception_handler(UserAlreadyExists, create_exception_handler(
        status_code=status.HTTP_400_BAD_REQUEST,
        message={
            "message": "User already exists ⛔👿",
            "error-code": "user-already-exists",
        }
    ))

    app.add_exception_handler(UserNotFound, create_exception_handler(
        status_code=status.HTTP_404_NOT_FOUND,
        message={
            "message": "User not found ⛔👿",
            "error-code": "user-not-found",
        }
    ))

    app.add_exception_handler(IncorrectEmailPassword, create_exception_handler(
        status_code=status.HTTP_401_UNAUTHORIZED,
        message={
            "message": "Incorrect email password ⛔👿",
            "error-code": "incorrect-email-password",
        }
    ))

    app.add_exception_handler(InvalidRefreshToken, create_exception_handler(
        status_code=status.HTTP_401_UNAUTHORIZED,
        message={
            "message": "Invalid Refresh Token ⛔👿",
            "error-code": "invalid-refresh-token",
        }
    ))

    app.add_exception_handler(InvalidCredentials, create_exception_handler(
        status_code=status.HTTP_401_UNAUTHORIZED,
        message={
            "message": "Invalid Credentials ⛔👿",
            "error-code": "invalid-credentials",
        }
    ))

    app.add_exception_handler(TokenBlacklisted, create_exception_handler(
        status_code=status.HTTP_401_UNAUTHORIZED,
        message={
            "message": "Token is blacklisted ⛔👿",
            "error-code": "token-blacklisted",
        }
    ))

    app.add_exception_handler(UserNotVerified, create_exception_handler(
        status_code=status.HTTP_400_BAD_REQUEST,
        message={
            "message": "User Not Verified ⛔👿",
            "error-code": "user-not-verified",
        }
    ))

    app.add_exception_handler(NotAuthorized, create_exception_handler(
        status_code=status.HTTP_401_UNAUTHORIZED,
        message={
            "message": "Not Allowed/Authorized. Only Admins are Allowed ⛔👿",
            "error-code": "not-allowed",
        }
    ))

    app.add_exception_handler(PasswordDidNotMatch, create_exception_handler(
        status_code=status.HTTP_400_BAD_REQUEST,
        message={
            "message": "Password did not match ⛔👿️️️",
            "error-code": "password-did-not-match",
        }
    ))

    app.add_exception_handler(IncorrectCurrentPassword, create_exception_handler(
        status_code=status.HTTP_401_UNAUTHORIZED,
        message={
            "message": "Incorrect Current Password  ⛔👿️️️",
            "error-code": "incorrect-current-password",
        }
    ))

    app.add_exception_handler(InvalidGoogleToken, create_exception_handler(
        status_code=status.HTTP_400_BAD_REQUEST,
        message={
            "message": "Invalid Google Token  ⛔👿️️️",
            "error-code": "invalid-google-token",
        }
    ))

    app.add_exception_handler(InvalidRedirectUri, create_exception_handler(
        status_code=status.HTTP_400_BAD_REQUEST,
        message={
            "message": "Invalid Redirect URI  ⛔👿️️️",
            "error-code": "invalid-redirect-uri",
        }
    ))

    app.add_exception_handler(EventNotFound, create_exception_handler(
        status_code=status.HTTP_400_BAD_REQUEST,
        message={
            "message": "Event Not Found  ⛔👿️️️",
            "error-code": "event-not-found",
        }
    ))
