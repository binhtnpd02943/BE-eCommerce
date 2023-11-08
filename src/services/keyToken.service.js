'use strict';

const { Types } = require('mongoose');
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

  static findByUserId = async (userId) => {
    return await keyStoreModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (id) => {
    return await keyStoreModel.deleteOne(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyStoreModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyStoreModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keyStoreModel.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
