import KafkaProducer from "./producer.js";
import {TOPIC_NAME} from "./constants.js";

const sendMessageToKafka = async (req, res) => {
    try {
        const {message} = req.body;
        const kafkaProducer = new KafkaProducer();
        const messages = [{key: "key1", value: message}];
        kafkaProducer.produce(TOPIC_NAME, messages);

        res.status(200).json({
            status: "Ok!",
            message: "Message successfully send!",
        });
    } catch (error) {
        console.log("Error sending message to Kafka:", error);
        res.status(500).json({
            status: "Error",
            message: "Failed to send message to Kafka",
        });
    }
};

const controllers = {sendMessageToKafka};

export default controllers;