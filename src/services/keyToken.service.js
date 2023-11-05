'use strict';

const keyStoreModel = require('../models/keyStore.model');

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const tokens = await keyStoreModel.create({
        user: userId,
        publicKey,
        privateKey,
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) {}
  };
}

module.exports = KeyTokenService;
