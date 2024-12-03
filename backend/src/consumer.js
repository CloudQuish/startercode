// consumer.js
import KafkaConsumer from "./kafka/Consumer.js"; // Kafka Consumer class
import { PAYMENT_TOPIC } from "./constants.js"; // Define your Kafka topic

// Set up consumer for payment events (could be payment success or failure)
const paymentEventConsumer = new KafkaConsumer('payment-group'); // Specify a unique consumer group

// Function to start consuming Kafka events
const consumePaymentEvents = async () => {
    await paymentEventConsumer.consume(PAYMENT_TOPIC, async (topic, partition, message) => {
        // Process message
        console.log(`Received message on topic: ${topic}, partition: ${partition}`);
        console.log(`Message: ${message}`);

        // Based on message content, take necessary actions (e.g., update booking, notify users, etc.)
        if (message.includes('payment-success')) {
            // Handle payment success (e.g., update booking status, notify user)
        } else if (message.includes('payment-failure')) {
            // Handle payment failure (e.g., update booking status to failed)
        }
    });
};

// Initialize the consumer on app startup (in main app or a separate service)
export {consumePaymentEvents}
