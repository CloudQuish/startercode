import asyncio

from celery import Celery

from app.mail import send_email_async

celery_app = Celery()

celery_app.config_from_object('config')  # config is config.py i.e filename


def run_async(coro):
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(coro)


@celery_app.task
def send_email_celery(addresses: list[str], subject: str, template_data: dict, template_name: str):
    try:
        run_async(
            send_email_async(
                addresses=addresses,
                subject=subject,
                template_data=template_data,
                template_name=template_name
            )
        )
        print("Email sent successfully 🙋🤣")
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        raise e
