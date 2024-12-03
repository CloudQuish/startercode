> - name: Suraj Sharma
> - email: er.surajsharma1389@gmail.com
> - phone: 9819692679
> - Role: Backend, Leader & Architect
> - Location: Kadaghari, Kathmandu
> - Github profile: https://github.com/S8r2j
> - Linkedin profile: https://www.linkedin.com/in/suraj-sharma-a049a31a8/
> - Resume: https://github.com/S8r2j/ticket_management_system/blob/master/suraj_sharma.pdf


# Ticket Booking System with FastAPI

FastAPI is an excellent choice for building a ticket booking system due to its high performance and scalability. Built on Starlette and Pydantic, it can handle a large number of concurrent requests with low latency, making it ideal for peak traffic times like ticket sales. Its asynchronous support ensures the system remains responsive, even under heavy load. Additionally, FastAPI’s easy API development, automatic documentation, and seamless integration with databases streamline building and maintaining the system.

## Key Features

- **High Performance**: Built for low latency and handling concurrent requests, ideal for peak traffic times.
- **Asynchronous Support**: Ensures the system remains responsive under heavy load, especially during I/O-bound operations like database and payment gateway interactions.
- **Easy API Development**: Quick creation of RESTful APIs, with built-in support for validation, documentation, and database integration.
- **Automatic Documentation**: Swagger UI and ReDoc for interactive API documentation, making development and debugging easier.
- **Data Validation**: Uses Pydantic for strong validation, ensuring correct user inputs and reducing errors.
- **Security**: Supports modern security practices like OAuth2, JWT, and API key validation for safe user authentication.
- **Scalability**: Designed to scale horizontally, efficiently handling multiple concurrent connections, especially with load balancing.
- **WebSockets**: Real-time updates, useful for pushing live information to users (e.g., ticket availability).
- **Microservices Support**: Easily integrates with a microservices-based architecture for handling different aspects like user management, payment processing, and ticket management.

## How to Run the Backend System

Follow the steps below to set up and run the backend system:

### Steps to Run
*Make sure you have python installed*
1. **Clone the Repository**  
   Clone this repository to your local machine.

2. **Setup PostgreSQL Database**  
   Configure your PostgreSQL database with the following:
   - Database name
   - Username
   - Password

3. **Navigate to the Project Directory**  
   Move to the project directory using the terminal.

4. **Configure Environment Variables**  
   - Rename `example.env` to `.env`.
   - Update the `.env` file with your secret credentials.

5. **Setup Redis Server**  
   Ensure you have Redis server installed and running on your local PC. If Redis is not already set up:  
   - Install WSL (Windows Subsystem for Linux) and configure the user and password.
   - Run the following commands step by step in WSL:
     ```bash
     sudo apt install redis
     ```
     Check Redis installation:
     ```bash
     redis-server --version
     ```
     Enable Redis server to start automatically:
     ```bash
     sudo systemctl enable redis-server
     ```
     Check redis server status:
     ```bash
     sudo service redis-server status
     ```

6. **Install dependencies**  
   Execute the dependency installation command to set up required packages:
   ```bash
   pip install -r requirements.txt
   ```

6. **Run Alembic Migration**  
   Execute the Alembic migration command to set up your database:
   ```bash
   alembic upgrade heads
   ```

7. **Run the command to run backend:**
    ```bash
    uvicorn main:app
    ```
*Note: Ensure redis server is active before running the backend server*

## How to set the admin?
    python -m scripts.admin <email> <true or false> 
`True` is for making the user admin and `False` is for removing the user from admin role

## How the locking mechanisms work?
The locking mechanism works as follows:

1. **Redis Locking with `SETNX`**  
   The function `acquire_ticket_lock` attempts to set a Redis key (`lock_ticket:{ticket_id}`). If the key doesn't exist, it locks the ticket using `SETNX`. If the key exists, the lock is not acquired.

2. **Expiration Time**  
   To prevent deadlocks, an expiration time is set on the lock using `expire`.

3. **Validation**  
   In the `book_ticket` function, before acquiring the lock, it checks if the ticket is already sold or locked. If not, it proceeds to lock the ticket.

4. **Lock Status**  
   If the lock is acquired, booking continues; if not, the operation stops, ensuring no conflicts.

This mechanism prevents concurrent ticket bookings and ensures only one process can lock and book the ticket at a time.

## How Stripe is integrated?
Stripe is integrated through the `stripe` Python library, which is used to interact with the Stripe API. The integration includes:

1. **Creating Stripe Prices**  
   The `create_stripe_price` function creates a price for events by specifying the price and product details.

2. **Stripe Checkout Sessions**  
   The `create_stripe_session_checkout` function creates a checkout session for processing payments, with line items, success, and cancellation URLs.

3. **Stripe Webhooks**  
   The `stripe_webhook_service` function handles Stripe webhook events to process payment outcomes, updating order and ticket statuses based on payment success or failure. It also verifies the webhook signature for security.

## Details Related to Kafka
As I am currently involved in another company as a backend dev, I had very limited time to work on the project. Redis, locking mechanism and Stripe were both new things for me but then also I had implemented them in the system with all the docs in the code. This is the system that I have completed in 2 nights since I had work during the office hours. So, I was unable to integrate Kafka in the system. Hope you will understand my position.

# Time Log
| Date       | Time Spent | Work                    |
|------------|------------|-------------------------|
| 2024-12-01 | 5 hours    | Redis integration within ticket booking and other features like user creation, event creation, ticket booking and testing & error handeling to some level|
| 2024-12-02 | 4 hours    | Stripe integration within ticket booking and other features like getting event details, admin right dependency, admin creation, getting customer orders, testing & error handeling to some level  |
| 2024-12-03 | 0 hours    | I couldn't do anything due to my other job since I am responsible for the role until I am involved in that company   |
