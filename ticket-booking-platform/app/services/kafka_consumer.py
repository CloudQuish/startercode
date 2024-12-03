from kafka import KafkaConsumer
import json
import logging
from app.core.config import kafka_settings
from app.services.mail import MailService
from app.core.database import get_db
from app.repositories.user import UserSqlRepository
from app.tasks import send_email_task


class NotificationService:
    def __init__(self):
        self.consumer = KafkaConsumer(
            kafka_settings.payment_notifications_topic,
            bootstrap_servers=kafka_settings.bootstrap_servers,
            auto_offset_reset="earliest",
            group_id=kafka_settings.notification_service_group,
            value_deserializer=lambda x: json.loads(
                x.decode("utf-8")
            ),  # Ensure decoding
            enable_auto_commit=True,
            max_poll_interval_ms=300000,
            max_poll_records=10,
            fetch_max_bytes=1048576,
        )
        # self.mail_service = MailService()
        logging.info("NotificationService initialized and consumer started.")

    def start_consuming(self):
        logging.info("NotificationService: Consumer started.")

        try:
            for message in self.consumer:
                logging.info(f"NotificationService received: {message.value}")

                order_id = message.value["order_id"]
                status = message.value["status"]
                amount = message.value["amount"]
                user_id = message.value["user_id"]

                if status == "success":
                    self.send_booking_confirmation_email(order_id, amount, user_id)
                elif status == "failed":
                    self.send_payment_failure_notification(order_id, user_id)

        except Exception as e:
            raise e
        finally:
            self.consumer.close()  # Close the consumer gracefully

    def send_booking_confirmation_email(self, order_id, amount, user_id):
        user_email = self.get_user_email(user_id)
        subject = f"Booking Confirmation - Order {order_id}"
        body = f"Thank you for your payment of ${amount:.2f}. Your booking (Order ID: {order_id}) has been confirmed."
        send_email_task.delay(
            recipient=user_email,
            subject=subject,
            body=body,
        )

    def send_payment_failure_notification(self, order_id, user_id):
        user_email = self.get_user_email(user_id)

        logging.info(f"Sending payment failure notification for Order ID ")
        subject = f"Payment Failure - Order {order_id}"
        body = f"We regret to inform you that your payment for Order ID {order_id} has failed. Please try again."
        send_email_task.delay(
            recipient=user_email,
            subject=subject,
            body=body,
        )

    def get_user_email(self, user_id):
        db = next(get_db())
        user = UserSqlRepository(db).get_user(user_id)
        return user.email


class WaitlistProcessor:
    def __init__(self):
        self.consumer = KafkaConsumer(
            kafka_settings.ticket_availability_topic,
            bootstrap_servers=kafka_settings.bootstrap_servers,
            auto_offset_reset="earliest",
            group_id=kafka_settings.waitlist_service_group,
            value_deserializer=lambda x: json.loads(x.decode("utf-8")),
        )
        logging.info("WaitlistProcessor initialized and ready to consume messages.")

    def start_consuming(self):
        logging.info("WaitlistProcessor: Consumer started.")
        try:
            for message in self.consumer:
                logging.info(f"WaitlistProcessor received: {message.value}")

                event_id = message.value["event_id"]
                status = message.value["status"]
                tickets_count = message.value["tickets_count"]

                if status == "available" and tickets_count > 0:
                    logging.info(f"Notifying waitlist users for event {event_id}.")
                    self.notify_waitlist_users(event_id, tickets_count)
        except Exception as e:
            logging.error(f"Error in WaitlistProcessor: {e}")

    def notify_waitlist_users(self, event_id, available_tickets):
        logging.info(
            f"Notifying waitlist users for event {event_id}. {available_tickets} tickets now available."
        )
        print(
            f"Notifying waitlist users for event {event_id}. {available_tickets} tickets now available."
        )
