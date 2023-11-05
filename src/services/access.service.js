'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError } = require('../core/error.response');

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
}

module.exports = AccessService;
