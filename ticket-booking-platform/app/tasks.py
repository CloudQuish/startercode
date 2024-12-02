from app.celery_app import celery_app
from app.services.mail import MailService
import logging
from celery.exceptions import MaxRetriesExceededError


# Celery task for sending emails with retry logic
@celery_app.task(
    bind=True, max_retries=3, default_retry_delay=60
)  # Retry 3 times with a 60-second delay
def send_email_task(self, recipient, subject, body):
    try:
        mail_service = MailService()
        mail_service.send_email(recipient, subject, body)
        logging.info(f"Successfully sent email to {recipient}.")
    except Exception as e:
        logging.error(f"Failed to send email to {recipient}. Error: {e}")
        try:
            self.retry(exc=e)  # Retry the task
        except MaxRetriesExceededError:
            logging.error(f"Max retries exceeded for sending email to {recipient}.")
