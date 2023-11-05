'use strict';

const keyStoreModel = require('../models/keyStore.model');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      //  level 0
      // const tokens = await keyStoreModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens.publicKey : null;

      // level xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = {
          upsert: true,
          new: true,
        };

      const tokens = await keyStoreModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {}
  };
}

module.exports = KeyTokenService;
