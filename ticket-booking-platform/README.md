Here’s the setup-focused `README.md` with project information and technologies used:

---

# Ticket Booking Platform

## Project Information

The **Ticket Booking Platform** is a backend system designed to facilitate secure and real-time ticket booking for events. It handles high-concurrency scenarios, processes payments securely, and provides real-time updates using an event-driven architecture.

### Key Objectives:
- **Concurrency Management**: Prevent overselling tickets with a locking mechanism.
- **Secure Payment Processing**: Integrate with Stripe for handling payments.
- **Real-Time Notifications**: Use Kafka to manage updates about ticket availability and payment status.

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
- **Zookeeper**: To manage Kafka services.

---

## Setup Instructions

### Prerequisites

1. Install **Docker** and **Docker Compose**.
2. Clone the repository:

   ```bash
   git clone <repository_url>
   cd ticket-booking-platform
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   POSTGRES_DB=ticket_booking
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=yourpassword
   REDIS_PORT=6379
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
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

This `README.md` provides all necessary information to start the project and includes the technologies used. Let me know if you need more details or additional sections!