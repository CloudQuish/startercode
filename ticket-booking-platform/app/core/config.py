from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Ticket Booking Platform"

    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    EMAIL_HOST: str
    EMAIL_PORT: str
    EMAIL_HOST_USER: str
    EMAIL_HOST_PASSWORD: str
    DEFAULT_FROM_EMAIL: str

    class Config:
        env_file = ".env"
        extra = "allow"  # This allows extra inputs without validation errors

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"


settings = Settings()


class KafkaSettings(BaseSettings):
    KAFKA_HOST: str = "kafka"
    KAFKA_PORT: str = "29092"
    ticket_availability_topic: str = "ticket_availability"
    payment_notifications_topic: str = "payment_notifications"
    notification_service_group: str = "notification_service"
    waitlist_service_group: str = "waitlist_service"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"

    @property
    def bootstrap_servers(self) -> str:
        return f"{self.KAFKA_HOST}:{self.KAFKA_PORT}"


kafka_settings = KafkaSettings()
