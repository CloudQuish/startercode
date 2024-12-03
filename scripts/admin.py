# to run this file, navigate to root folder and run command: python -m scripts.admin <user_emal> <true or false>
import asyncio
import click
import asyncpg
from pydantic import EmailStr

from core.config import db_settings

db_user=db_settings.DATABASE_USER
db_pwd=db_settings.DATABASE_PASSWORD
db_host=db_settings.DATABASE_HOST
db_port=db_settings.DATABASE_PORT
db_name=db_settings.DATABASE_NAME

DATABASE_URL = f"postgresql://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}"

async def set_admin(email: EmailStr, is_admin: bool):
    """
    Asynchronously sets the is_admin flag for a user.
    """
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        query = """
        UPDATE users
        SET is_admin = $1
        WHERE email = $2
        """
        await conn.execute(query, is_admin, email)
        status = "Admin" if is_admin else "Not Admin"
        print(f"Successfully updated User with email {email} to {status}.")
    except Exception as e:
        print(f"Error updating user: {e}")
    finally:
        await conn.close()

@click.command()
@click.argument('email', type=str)
@click.argument('is_admin', type=bool)
def cli_set_admin(email, is_admin):
    """
    Set the is_admin flag for a user asynchronously.

    \b
    Arguments:
    email -- The Email of the user to update
    is_admin -- True or False to set the admin status
    """
    asyncio.run(set_admin(email, is_admin))

if __name__ == "__main__":
    cli_set_admin()
