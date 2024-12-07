import smtplib
from email.message import EmailMessage
from app.core.config import settings
import logging


class MailService:
    def __init__(self):
        self.smtp_host = settings.EMAIL_HOST
        self.smtp_port = settings.EMAIL_PORT
        self.smtp_username = settings.EMAIL_HOST_USER
        self.smtp_password = settings.EMAIL_HOST_PASSWORD
        self.smtp_from_email = settings.DEFAULT_FROM_EMAIL

    def send_email(self, recipient, subject, body):
        try:
            msg = EmailMessage()
            msg["From"] = self.smtp_from_email
            msg["To"] = recipient
            msg["Subject"] = subject
            msg.set_content(body)

            # Connect to the SMTP server and send the email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()  # Upgrade connection to secure
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)

            logging.info(f"Email sent to {recipient} with subject: {subject}")
        except Exception as e:
            print(f"Failed to send email to {recipient}. Error: {e}")
