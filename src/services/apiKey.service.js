'use strict';

const crypto = require('node:crypto');
const apiKeyModel = require('../models/apiKey.model');

const findById = async (key) => {
  const newKey = await apiKeyModel.create({
    key: crypto.randomBytes(64).toString('hex'),
    permissions: ['0001'],
  });
  console.log('newKey::', newKey);
  const objectKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objectKey;
};

module.exports = { findById };
