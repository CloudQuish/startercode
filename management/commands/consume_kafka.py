from app.notification.notification_kafka_consumer import start_notification_consumer
from management.base import BaseCommand


class ConsumeKafkaCommand(BaseCommand):
    name = "consume_kafka"
    help = "Start the Kafka consumer for geo data"

    def handle(self, *args, **options):
        start_notification_consumer()
