import os
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app.auth.google_oauth import google_oauth_router
from app.auth.routers import auth_router
from app.custom_exception import register_all_errors
from app.db_connection import shutdown, startup
from app.events.routers import events_router
from config import MODE

version = "v1"


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Server Starting.....")
    await startup()
    yield
    await shutdown()
    print("Server Stopped.....")


app = FastAPI(
    title="TicketBooking API",
    description=f"{version} - TicketBooking REST API",
    version=version,
    lifespan=lifespan,
    docs_url=f"/api/{version}/docs",
    redoc_url=f"/api/{version}/redoc",
    contact={
        "name": "ajay",
        "email": "ajaythk.94@gmail.com",
    }
)

if MODE == "development":
    origins = ['*']
    allowed_hosts = ['*']
else:
    origins = ['*']
    allowed_hosts = [
        "localhost",
        "127.0.0.1",
    ]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted Host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=allowed_hosts
)


@app.get("/")
def welcome_to_ticketbooking():
    return {"message": "Welcome to Ticket Booking API..🙏🙏"}


register_all_errors(app)  # Register All Errors from custom_exception file in main file

app.include_router(auth_router, prefix=f"/api/{version}/auth")
app.include_router(google_oauth_router, prefix=f"/api/{version}")
app.include_router(events_router, prefix=f"/api/{version}/events")


# Run Project At Specified Port
if __name__ == "__main__":
    if MODE == "development":
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    else:
        # For production, let the platform set the port
        port = int(os.getenv("PORT", 8000))
        uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
