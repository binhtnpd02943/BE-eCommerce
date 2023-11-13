'use strict';
const redis = require('redis');
const { promisify } = require('util');
const {
  reservationInventory,
} = require('../models/repositories/inventory.repository');

const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setEx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3 seconds tạm lock

  for (let i = 0; i < retryTimes.length; i++) {
    // tao mot key, thang nao năm giữ được vào thanh toán
    const result = await setnxAsync(key, expireTime);
    console.log(`result:::`, result);
    if (result === 1) {
      // thao tac voi inventory
      const isReversion = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReversion.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }

      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
