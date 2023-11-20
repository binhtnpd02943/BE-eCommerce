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

    for (let i = 0; i < 10; i++) {
      const message = `ordered-queued-message::${i}`;
      console.log('message', message);
      channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true,
      });
    }

    setTimeout(() => {
      connection.close();
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}

consumerOrderMessage()
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
