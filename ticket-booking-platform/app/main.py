import threading
from fastapi import FastAPI
from app.core.database import engine, Base
from app.api.routes import router as api_router
from app.services.kafka_consumer import WaitlistProcessor, NotificationService
from app.core.middlewares.auth_middlewares import AuthMiddleware
from app.tasks import send_email_task


app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(api_router)
app.add_middleware(AuthMiddleware)


notification_service = NotificationService()
waitlist_processor = WaitlistProcessor()


threads = []


@app.on_event("startup")
def startup_event():
    print("Starting Kafka consumers...")
    send_email_task.delay(recipient="thapa.qw12@gmail.com", subject="Test", body="Test")
    print("...")

    # Start the Kafka consumer for NotificationService in a separate thread
    notification_thread = threading.Thread(
        target=notification_service.start_consuming, daemon=True
    )

    threads.append(notification_thread)
    notification_thread.start()

    # Start the Kafka consumer for WaitlistProcessor in a separate thread
    waitlist_thread = threading.Thread(
        target=waitlist_processor.start_consuming, daemon=True
    )
    threads.append(waitlist_thread)
    waitlist_thread.start()

    print("Kafka consumers started.")


@app.on_event("shutdown")
def shutdown_event():
    # Gracefully stop Kafka consumers
    print("Shutting down Kafka consumers...")
    notification_service.consumer.close()
    waitlist_processor.consumer.close()
    for thread in threads:
        thread.join()  # Ensure threads exit properly


@app.get("/")
def read_root():
    return {"message": "Ticket Booking Platform"}
