const amqp = require('amqplib');

const log = console.log;

console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

async function consumerOrderMessage() {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queued-message';
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // Set prefetch to 1 to ensure one ack at a time
    // channel.prefetch(1);

    channel.consume(queueName, (msg) => {
      const message = msg.content.toString();

      setTimeout(() => {
        console.log('processed', message);
        // if (msg === 3) {
        //   return;
        // }
        channel.ack(msg);
      }, Math.random() * 1000);
    });
  } catch (error) {
    console.error(error);
  }
}

consumerOrderMessage()
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
