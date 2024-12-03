import os
from celery import Celery

# Configure Celery with Redis broker and backend
CELERY_BROKER = os.getenv("CELERY_BROKER", "redis://redis:6379/0")
CELERY_BACKEND = os.getenv("CELERY_BACKEND", "redis://redis:6379/0")

celery_app = Celery(
    "tasks", broker=CELERY_BROKER, backend=CELERY_BACKEND, include=["app.tasks"]
)  # Ensure the tasks module is included


celery_app.conf.task_routes = {"app.tasks.send_email_task": {"queue": "worker"}}
celery_app.conf.timezone = "UTC"
