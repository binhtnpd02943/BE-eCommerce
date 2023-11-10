'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const { keyBy } = require('lodash');
const e = require('express');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static sigUp = async ({ name, email, mobile, password }) => {
    // step1: check email exists
    const holderEmail = await shopModel.findOne({ email }).lean();
    if (holderEmail) {
      throw new BadRequestError('Error: Email already registered!');
    }
    // step2: check mobile exists
    const holderMobile = await shopModel.findOne({ mobile }).lean();
    if (holderMobile) {
      throw new BadRequestError('Mobile already registered!');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      mobile,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // Created privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      console.log({ privateKey, publicKey }); // save collection keyStore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: 'xxx',
          message: 'keyStore error',
        };
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`Create token success::`, tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['_id', 'name', 'email', 'mobile'],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };

  /*
   1- check email in dbs
   2 - match password
   3 - create AT vs RT and Save
   4 - get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1- check email in dbs
    const foundShop = await findByEmail({ email });
    if (!findByEmail) throw new BadRequestError('Shop not registered!');

    // 2 - match password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError('Authentication Error');

    // 3 - create AT vs RT and Save
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    // generate token
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email', 'mobile'],
        object: foundShop,
      }),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);

    return delKey;
  };

  // V2 fixed
  static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      // xoa tat ca token trong keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong happened !! Please reLogin');
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError('Shop not Registered!');

    // check UerId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop not Registered two!');

    // create 1 cap moi
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // da duoc su dung de lay token moi
      },
    });
    return {
      user,
      tokens,
    };
  };
}

module.exports = AccessService;
