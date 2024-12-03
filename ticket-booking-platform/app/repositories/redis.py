import redis
import time
import uuid
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")


class RedisClient:
    def __init__(self, host="redis", port=6379, db=0):

        if REDIS_URL:
            self.redis_client = redis.from_url(REDIS_URL, decode_responses=True)
        else:
            self.redis_client = redis.Redis(
                host=host, port=port, db=db, decode_responses=True
            )

    def acquire_lock(self, lock_name, timeout=10):
        """
        Acquire a distributed lock using Redis
        """
        # Generate a unique lock identifier
        lock_value = str(uuid.uuid4())

        # Try to set the lock with an expiration
        if self.redis_client.set(lock_name, lock_value, nx=True, ex=timeout):
            return lock_value
        return None

    def release_lock(self, lock_name, lock_value=None):
        """
        Release a distributed lock
        """
        # If no specific lock_value is provided, just delete the lock
        if lock_value is None:
            return self.redis_client.delete(lock_name)

        # Ensure we only release the lock if it matches the original lock value
        lua_script = """
        if redis.call('get', KEYS[1]) == ARGV[1] then
            return redis.call('del', KEYS[1])
        else
            return 0
        end
        """
        return self.redis_client.eval(lua_script, 1, lock_name, lock_value)


# Global Redis client instance
redis_client = RedisClient()


def get_redis_client() -> RedisClient:
    return redis_client
