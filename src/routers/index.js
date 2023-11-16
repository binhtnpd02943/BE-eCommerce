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
// discount
router.use('/v1/api/discount', require('./discount'));
// cart
router.use('/v1/api/cart', require('./cart'));
// checkout
router.use('/v1/api/checkout', require('./checkout'));
// inventory
router.use('/v1/api/inventory', require('./inventory'));
// inventory
router.use('/v1/api/comment', require('./comment'));
// check permission
router.use('/v1/api', require('./access'));

module.exports = router;
