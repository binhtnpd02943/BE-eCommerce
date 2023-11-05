'use strict';

const crypto = require('node:crypto');
const apiKeyModel = require('../models/apiKey.model');

const findById = async (key) => {
  const objectKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objectKey;
};

module.exports = { findById };
