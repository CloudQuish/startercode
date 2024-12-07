## About me
- **Name** : Samir thapa
- **Email** : samirthapa61622845@gmail.com
- **Role** : Backend 
- **Address** : Hetauda,Nepal
- **Github** : github.com/thapasamir
- **Linkened** : https://www.linkedin.com/in/samir-thapa-73a9a31b6/



# Ticket Booking Platform

###
Note : This project wont run properly if not conifigured propely, Make sure to put the http://backend_url/webhook/payment/ in stripe webhook section. 

If running locally then can you ngrok to test it for webhook endpoint
## Project Information

The **Ticket Booking Platform** is a backend system designed to facilitate secure and real-time ticket booking for events. It handles high-concurrency scenarios, processes payments securely, and provides real-time updates using an event-driven architecture.

### Key Objectives:
- **Concurrency Management**: Prevent overselling tickets with a locking mechanism.
- **Secure Payment Processing**: Integrate with Stripe for handling payments.
- **Real-Time Notifications**: Use Kafka to manage updates about ticket availability and payment status.

- **Background Task Handling**: Use Celery to manage asynchronous tasks like sending emails.


---

## Technologies Used

- **FastAPI**: For creating a high-performance and scalable REST API.
- **Redis**: As an in-memory store for ticket locks and concurrency control.
- **PostgreSQL**: For persistent data storage.
- **Stripe API**: For secure payment processing using test mode.
- **Kafka**: For event-driven real-time messaging.
- **Docker**: To containerize the application and its dependencies.
- **Alembic**: For database migrations.
- **Python**: The primary programming language for backend logic.
- **Celery**: For asynchronous background task handling.
- **Zookeeper**: To manage Kafka services.

---

## Setup Instructions

### Prerequisites

1. Install **Docker** and **Docker Compose**.
2. Clone the repository:

   ```bash
   git clone https://github.com/thapasamir/startercode
   cd ticket-booking-platform
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   POSTGRES_DB=example_db
   POSTGRES_USER=example_user
   POSTGRES_PASSWORD=example_password
   POSTGRES_HOST=db
   POSTGRES_PORT=5432

   SECRET_KEY=example_secret_key_12345

   REDIS_PORT=6379
   REDIS_URL=redis://example_redis_host:6379/0

   KAFKA_HOST=example_kafka_host
   KAFKA_PORT=9092

   STRIPE_SECRET_KEY=sk_test_example_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_example_webhook_secret

   EMAIL_HOST=email-smtp.example-region.amazonaws.com
   EMAIL_PORT=587
   EMAIL_HOST_USER=example_email_user
   EMAIL_HOST_PASSWORD=example_email_password
   DEFAULT_FROM_EMAIL=Example Name <no-reply@example.com>
   TO_EMAIL=recipient@example.com

   JWT_SECRET_KEY=example_jwt_secret_key

   ```

### Running the Application

1. Build and start the services using Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. Once started:
   - The API is available at: `http://localhost:8000`
   - API documentation is accessible at: `http://localhost:8000/docs`

3. Apply database migrations:

   ```bash
   docker exec -it backend alembic upgrade head
   ```

4. Verify Kafka and Zookeeper are running for message handling.

---

## Stopping the Application

To stop all running services:

```bash
docker-compose down
```

---