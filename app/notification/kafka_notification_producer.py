import json
import logging
import os
from typing import Dict

from dotenv import load_dotenv
from kafka import KafkaProducer
from kafka.errors import KafkaError

load_dotenv()

# Kafka Configuration
# KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
TICKET = 'ticket_booking_notifications'


class NotificationService:
    def __init__(self):
        try:
            # Initialize Kafka Producer
            self.producer = KafkaProducer(
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            print("Successfully connected to Kafka...")
        except KafkaError as e:
            logging.error(f"Kafka Producer initialization error: {e}")
            raise

    def send_booking_notification(self, ticket_info: Dict):
        """
        Send ticket booking notification via Kafka

        Args:
            ticket_info (Dict): Ticket and user details
        """
        try:
            self.producer.send(TICKET, ticket_info)
            self.producer.flush()
        except KafkaError as e:
            logging.error(f"Error sending Kafka message: {e}")