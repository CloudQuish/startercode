import kafka from "./Config.js";

class KafkaProducer {
    constructor() {
        this.producer = kafka.producer();
    }

    async produce(topic, messages) {
        try {
            await this.producer.connect();
            await this.producer.send({
                topic: topic,
                messages: messages,
            });
        } catch (error) {
            console.error('Kafka Producer Error', error);
        } finally {
            await this.producer.disconnect();
        }
    }
}

export default KafkaProducer;
