from models.database import session

async def get_db():
    """
    This function provides a database session for use within API route 
    handlers or services. It utilizes an asynchronous session context to 
    ensure proper initialization and cleanup of the database connection. 
    The session is yielded for use and automatically closed after the operation 
    completes, ensuring efficient resource management.
    """
    db = session()
    async with session() as db:
        yield db