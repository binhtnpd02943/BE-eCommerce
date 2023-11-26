'use strict';
const { createClient } = require('redis');

class RedisPubSubService {
  constructor() {
    this.subscriber = createClient({
      url: process.env.REDIS_URL,
    });
    this.publisher = createClient({
      url: process.env.REDIS_URL,
    });
  }

  publish(channel, message) {
    try {
      return new Promise((resolve, reject) => {
        this.publisher.publish(channel, message, (err, reply) => {
          if (err) {
            reject(err);
          } else {
            resolve(reply);
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel);
    this.subscriber.on('message', (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(channel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();
