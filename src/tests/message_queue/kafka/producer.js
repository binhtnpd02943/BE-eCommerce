const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
  logLevel: logLevel.NOTHING,
});

const producer = kafka.producer();

const runProducer = async () => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'test-topic',
      messages: [{ value: 'Hello KafkaJS user By BinhTN!' }],
    });
    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error producing message:', error);
  } finally {
    await producer.disconnect();
  }
};

runProducer().catch(console.error);
