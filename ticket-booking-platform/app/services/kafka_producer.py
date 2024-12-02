import logging
from kafka import KafkaProducer
import json
import uuid
from datetime import datetime
from app.core.config import kafka_settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class KafkaEventProducer:
    def __init__(self):
        self.producer = KafkaProducer(
            bootstrap_servers=kafka_settings.bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        )
        logger.info(
            "KafkaEventProducer initialized with bootstrap servers: %s",
            kafka_settings.bootstrap_servers,
        )

    def publish_ticket_availability(
        self, event_id: uuid.UUID, status: str, tickets: int
    ):
        message = {
            "event_id": str(event_id),
            "status": status,
            "tickets_count": tickets,
            "timestamp": str(datetime.now()),
        }
        topic = kafka_settings.ticket_availability_topic
        self.producer.send(topic, message)
        self.producer.flush()
        logger.info(
            "Published ticket availability message to topic '%s': %s", topic, message
        )

    def publish_payment_notification(
        self, order_id: uuid.UUID, status: str, amount: float, user_id: uuid.UUID
    ):
        message = {
            "order_id": str(order_id),
            "status": status,
            "amount": amount,
            "user_id": user_id,
            "timestamp": str(datetime.now()),
        }
        topic = kafka_settings.payment_notifications_topic
        self.producer.send(topic, message)
        self.producer.flush()
        logger.info(
            "Published payment notification message to topic '%s': %s", topic, message
        )
