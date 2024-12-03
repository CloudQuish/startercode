# This is a ticket booking app developed using FastAPI

# To see the detail documentation of the API 
http://127.0.0.1:8000/api/v1/docs

# To start fastapi server
fastapi dev main.py (in development mode)
fastapi run (in production mode)

# For database creation and migration use these commands
alembic init alembic

alembic revision --autogenerate -m "initial"

alembic -n ticketbooking revision --autogenerate -m "initial"

alembic -n ticketbooking upgrade head


# To start celery tasks use these commands
celery -A app.celery_tasks.celery_app worker  --loglevel=INFO

celery -A app.celery_tasks.celery_app flower



# To Start Kafka

# Extract the downloaded file
tar -xzf kafka_2.13-3.5.0.tgz cd kafka_2.13-3.5.0

# To Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Go To
nano config/server.properties

# Ensure these
listeners=PLAINTEXT://localhost:9092 advertised.listeners=PLAINTEXT://localhost:9092

# Open a new terminal window and run
bin/kafka-server-start.sh config/server.properties

# Open another terminal window and create the topic you'll be using
bin/kafka-topics.sh --create --topic TICKET_BOOKING_TOPIC --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

# Verify the topic was created
bin/kafka-topics.sh --list --bootstrap-server localhost:9092

# Then Run this command in different terminal
python manage.py runserver python consume_kafka