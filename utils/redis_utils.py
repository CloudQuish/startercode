import asyncio
import redis.asyncio as redis_async

from schemas.event_schema import TicketStatus, OrderStatus
from models.database import session
from controllers.event_controllers import event_control

async def acquire_ticket_lock(ticket_id:int, timeout=30):
    """
    Acquires the lock on a ticket.

    Args:
        ticket_id (int): The ID of the ticket to lock.
        timeout (miliseconds): Milliseconds to hold the lock onto the ticket

    Returns:
        bool: True if the lock was acquired successfully, False otherwise.
    """
    redis = await redis_async.from_url('redis://localhost')
    # Check if notify-keyspace-events is configured
    config = await redis.config_get('notify-keyspace-events')
    if 'Ex' not in config['notify-keyspace-events']:
        print("Warning: Redis keyspace events not properly configured")
        await redis.config_set('notify-keyspace-events', 'Ex')
    lock_key = f"lock_ticket:{ticket_id}"
    lock_value = TicketStatus.LOCKED.value # This can be any unique value like a session ID

    # Attempt to acquire the lock using SETNX (SET if Not Exists)
    lock_acquired = await redis.setnx(lock_key, lock_value)
    if lock_acquired:
        # Set an expiration time on the lock to avoid deadlock
        await redis.expire(lock_key, timeout)
        await redis.close()
        return True
    else:
        await redis.close()
        return False

async def release_ticket_lock(ticket_id: int):
    """
    Removes the lock from a ticket manually.

    Args:
        ticket_id (int): The ID of the ticket to unlock.

    Returns:
        bool: True if the lock was removed successfully, False otherwise.
    """
    redis = await redis_async.from_url('redis://localhost')
    lock_key = f"lock_ticket:{ticket_id}"

    # Delete the lock key
    lock_removed = await redis.delete(lock_key)
    await redis.close()

    if lock_removed:
        print(f"Lock for ticket {ticket_id} successfully removed.")
        return True
    else:
        print(f"No lock exists for ticket {ticket_id}.")
        return False

class RedisManager:
    """
    Manages the Redis connection and listens for key expiration events. 
    It starts and stops the Redis client and subscribes to the expiration 
    events. When an event occurs, it updates the ticket status and order 
    status in the database to reflect the change (e.g., setting the ticket 
    to "AVAILABLE" and order to "FAILED").
    """
    def __init__(self):
        self.redis_client = None
        self.listener_task = None

    async def start(self):
        self.redis_client = await redis_async.from_url('redis://localhost')
        self.listener_task = asyncio.create_task(self.lock_expiration_listener())
        print("Redis listener started")

    async def stop(self):
        if self.listener_task:
            self.listener_task.cancel()
            try:
                await self.listener_task
            except asyncio.CancelledError:
                pass
        
        if self.redis_client:
            await self.redis_client.close()
            print("Redis connection closed")

    async def lock_expiration_listener(self):
        try:
            pubsub = self.redis_client.pubsub()
            await pubsub.psubscribe("__keyevent@0__:expired")
            print("Subscribed to expiration events")

            async for message in pubsub.listen():
                if message["type"] == "pmessage":
                    ticket_id = message["data"].decode("utf-8").split(":")[1]
                    async with session() as db:
                        # update ticket status
                        ticket = await event_control(db).get_locked_ticket_by_id(ticket_id=int(ticket_id))
                        updated_ticket = await event_control(db).update_ticket_status(ticket, TicketStatus.AVAILABLE)
                        # update order status to failed
                        order = await event_control(db).get_order_by_ticket_id(int(ticket_id))
                        updated_order = await event_control(db).update_order_status(order=order, status=OrderStatus.FAILED)
                    print(f"Updated ticket {ticket_id}")
        except asyncio.CancelledError:
            await pubsub.close()
            raise
        except Exception as e:
            print(f"Error in listener: {e}")

redis_manager = RedisManager()