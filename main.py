import asyncio
from fastapi import FastAPI
from routes.user_routes import user_route
from routes.event_routes import event_router
from utils.redis_utils import redis_manager

app=FastAPI()


async def lifespan(app):
    """
    This code defines an asynchronous lifespan context 
    manager for the FastAPI application, managing the 
    startup and shutdown processes. During startup, it 
    initializes the Redis manager, and on shutdown, it 
    ensures the Redis connection is properly closed.
    """
    # Startup
    await redis_manager.start()
    yield
    # Shutdown
    await redis_manager.stop()

app = FastAPI(lifespan=lifespan)


app.include_router(user_route)
app.include_router(event_router)

