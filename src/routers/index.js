'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(apiKey);
// check permission
router.use(permission('0001'));

// product
router.use('/v1/api/product', require('./product'));
// check permission
router.use('/v1/api', require('./access'));

module.exports = router;
