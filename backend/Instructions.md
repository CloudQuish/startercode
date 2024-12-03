
# **Please do not start before reading Master_Readme.md. and instructions provided below:**

# **Ticket Booking Platform**

## **Objective**

Build a ticket booking backend system that handles:

1. **Concurrency Management**: Prevent overselling tickets by implementing a locking mechanism.
2. **Stripe Integration**: Process payments securely. For now, use Stripe test mode's Checkout or Payment Intents. You should be able to read through the [Stripe API documentation](https://stripe.com/docs/api) to understand how to integrate it.
3. **Real-Time Updates**: Use Kafka for event-driven updates about ticket availability and payment status. For now, focus on publishing and consuming messages for ticket availability and payment notifications. However, feel free to add any other topics or consumers as needed.

---

## **Key Features**

### **1. Ticket Booking**

#### **Booking Tickets**

- **Endpoint**: `POST /events/:id/book` (or similar that makes sense)
- **Functionality**:
  - Lock tickets when a user starts the booking process to prevent overselling.
  - Return a Stripe payment session link or client secret for completing the payment.
  - Store booking details (user, event, tickets, status) in the database.

#### **Concurrency Management**

- Use **Redis** or a similar mechanism to:
  - Lock tickets for a user during the booking process.
  - Release the lock:
    - Immediately if payment fails.
    - After a timeout (e.g., 5 minutes) if the user does not complete the payment.
  - Prevent other users from booking the same tickets until the lock is released.

#### **Order Expiration**

- Pending orders expire automatically after the timeout.
- Expired orders should release their associated tickets.

---

### **2. Payment Processing**

#### **Stripe Checkout Integration**

- **Endpoint**: Use Stripe Checkout or Payment Intents for payments.
- **Flow**:
  1. Create a Stripe Checkout session or Payment Intent when the user starts the booking.
  2. Redirect the user to Stripe to complete the payment.

#### **Webhook Validation**

- **Endpoint**: `POST /webhook` (or similar)
- **Functionality**:
  - Listen for Stripe webhook events:
    - `payment_intent.succeeded` or `checkout.session.completed` to confirm successful payments.
    - Mark the order as "Confirmed" upon payment success.
    - Release ticket locks and mark the order as "Failed" if the payment fails.
  - Validate the webhook signature to ensure authenticity.

---

### **3. Ticket Management**

#### **Event Management**

- **Endpoint**: `POST /events`
- **Functionality**:
  - Admins can create or update events with details like:
    - Event name, description, date, venue, ticket price, and total tickets available.
  - Store event details in the database.

#### **Ticket Status**

- **Endpoint**: `GET /orders/:id`
- **Functionality**:
  - Allow users to check the status of their bookings (Pending, Confirmed, Failed).

#### **Real-Time Ticket Availability**

- Use **Kafka** to publish messages about ticket availability:
  - Notify when tickets are locked, unlocked, or sold.
  - Consumers can listen to these updates for real-time UI updates or waitlist processing.

---

### **4. Real-Time Messaging**

#### **Kafka Topics**

- **`ticket_availability`**:
  - Messages about ticket locks, unlocks, and sales.
- **`payment_notifications`**:
  - Messages about payment statuses (success or failure).

#### **Consumers**

- **Notification Service**:
  - Send booking confirmations via email or SMS when payment succeeds.
- **Waitlist Processor**:
  - Notify users on the waitlist when tickets become available.

---

## **Stretch Features**

1. **Waitlist Management**

   - Add a waitlist feature for sold-out events.
   - Notify waitlisted users via Kafka when tickets are unlocked.

2. **Refund System**

   - Allow users to cancel bookings within a certain timeframe.
   - Process refunds through Stripe and release tickets back to inventory.

3. **Admin Dashboard**
   - Add a real-time admin dashboard to display:
     - Tickets sold, revenue, and waitlist metrics.

---

## **Database Schema** (Decide based on your implementation, Given below is just a suggestion)

### Suggested Tables:

1. **Users**

   - `id`: Unique identifier.
   - `name`: User name.
   - `email`: User email.

2. **Events**

   - `id`: Unique identifier.
   - `name`: Event name.
   - `date`: Event date.
   - `venue`: Event venue.
   - `price`: Ticket price.
   - `total_tickets`: Total tickets available.

3. **Tickets**

   - `id`: Unique identifier.
   - `event_id`: Associated event ID.
   - `status`: Ticket status (Available, Locked, Sold).

4. **Orders**
   - `id`: Unique identifier.
   - `user_id`: Associated user ID.
   - `event_id`: Associated event ID.
   - `status`: Order status (Pending, Confirmed, Failed).
   - `stripe_session_id`: Stripe session or payment intent ID.

---

## **Evaluation Criteria**

1. **Concurrency Management**

   - Locks are implemented to prevent ticket overselling.
   - Locks are released correctly on payment failure or timeout.

2. **Stripe Integration**

   - Payments are processed securely in test mode.
   - Stripe webhook events are validated and handled properly.

3. **Real-Time Messaging**

   - Kafka topics and consumers are correctly implemented for ticket updates and notifications.

4. **Code Quality**

   - Modular and maintainable code.
   - Clear documentation for API endpoints and project setup.

5. **Scalability**
   - The system can handle high-concurrency scenarios during ticket sales.

---

## **Project Deliverables**
1. Required stuffs from master readme
2. Fully functional backend system adhering to the requirements.
3. Postman or cURL examples for all API endpoints. (optional but recommended)
4. Documentation explaining: (optional but recommended, but we atleast need the readme.md explaining the project setup and how to run the project)
   - Locking mechanism.
   - Stripe integration details.
   - Kafka messaging implementation.

---




