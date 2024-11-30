import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

load_dotenv()
app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent.parent

mail_config = ConnectionConfig(
    MAIL_USERNAME=os.environ.get("MAIL_USERNAME"),
    MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD"),
    MAIL_FROM=os.environ.get("MAIL_FROM"),
    MAIL_PORT=int(os.environ.get("MAIL_PORT", 465)),
    MAIL_SERVER=os.environ.get("MAIL_SERVER"),
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=Path(BASE_DIR, "templates")
)

mail = FastMail(config=mail_config)


async def send_email_async(addresses: list[str], subject: str, template_name: str, template_data: dict):
    message = MessageSchema(
        subject=subject,
        recipients=addresses,
        template_body=template_data,
        subtype=MessageType.html
    )
    await mail.send_message(message, template_name=template_name)


def send_email_sync(addresses: list[str], subject: str, template_name: str, template_data: dict):
    """Synchronous version of email sending"""
    import asyncio

    async def _send_email():
        message = MessageSchema(
            subject=subject,
            recipients=addresses,
            template_body=template_data,
            subtype=MessageType.html
        )
        await mail.send_message(message, template_name=template_name)

    # Create new event loop and run the async function
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(_send_email())
    finally:
        loop.close()
