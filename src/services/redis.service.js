'use strict';
const { promisify } = require('util');
const {
  reservationInventory,
} = require('../models/repositories/inventory.repository');

const redisClient = require('../databases/init.redis');

const pExpire = promisify(redisClient.pexpire).bind(redisClient);
const setNxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3 seconds tạm lock

  for (let i = 0; i < retryTimes; i++) {
    // tao mot key, thang nao năm giữ được vào thanh toán
    const result = await setNxAsync(key, expireTime);
    console.log(`result:::`, result);
    if (result === 1) {
      // thao tac voi inventory
      const isReversion = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReversion.modifiedCount) {
        await pExpire(key, expireTime);
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
