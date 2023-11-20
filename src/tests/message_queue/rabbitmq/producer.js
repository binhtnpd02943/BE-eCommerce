const amqp = require('amqplib');

const messages = 'New a product, Iphone 15 pro max';

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const queueName = 'test-topic';
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // Send messages to consumer channel
    channel.sendToQueue(queueName, Buffer.from(messages));
    console.log(`message send:`, messages);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(`error:`, error);
  }
};

runProducer().catch(console.error);
