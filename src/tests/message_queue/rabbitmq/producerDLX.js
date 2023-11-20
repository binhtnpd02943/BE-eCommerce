const amqp = require('amqplib');

const messages = 'New a product, Iphone 15 pro max';

const log = console.log;

console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const notificationExchange = 'notificationEx'; // notificationEx direct
    const notificationQueue = 'notificationQueueProcess'; // assertQueue
    const notificationExchangeDLX = 'notificationExDLX'; // notificationEx direct
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // assert

    // 1. create Exchange
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true,
    });

    // 2. create Queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false, // Cho phép các kết nối truy cập vào cùng 1 lúc hàng đợi
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // 3. bindQueue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // 4. Send message
    const message = 'A new product';
    console.log(`producer message::`, message);
    await channel.sendToQueue(queueResult.queue, Buffer.from(message), {
      expiration: 10000,
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(`error:`, error);
  }
};

runProducer()
  .then((res) => console.log(res))
  .catch(console.error);
