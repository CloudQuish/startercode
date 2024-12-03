import json
import logging

from kafka import KafkaConsumer
from app.celery_tasks import send_email_celery
from app.notification.kafka_notification_producer import TICKET_BOOKING_TOPIC, KAFKA_BOOTSTRAP_SERVERS


def start_notification_consumer():
    """
    Kafka consumer to process ticket booking notifications
    """
    consumer = KafkaConsumer(
        TICKET_BOOKING_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id='ticket_notification_group',
        value_deserializer=lambda x: json.loads(x.decode('utf-8'))
    )

    for message in consumer:
        ticket_info = message.value

        try:
            # Send email notification
            send_email_celery.delay(
                addresses=[ticket_info['email']],
                subject="Ticket Booking Confirmation",
                template_name="ticket_booking.html",
                template_data={
                    "event_name": ticket_info['event_name'],
                    "ticket_count": ticket_info['ticket_count'],
                    "event_date": ticket_info['event_date']
                }
            )

            # Send SMS notification
            # send_sms_celery.delay(
            #     phone_number=ticket_info['phone_number'],
            #     message=f"Your ticket for {ticket_info['event_name']} is confirmed. Ticket count: {ticket_info['ticket_count']}"
            # )
        except Exception as e:
            logging.error(f"Notification sending error: {e}")