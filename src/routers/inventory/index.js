'use strict';

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const checkoutController = require('../../controllers/checkout.controller');
const inventoryController = require('../../controllers/inventory.controller');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// authentication
router.use(authentication);

router.post('', asyncHandler(inventoryController.addStockToInventory));

module.exports = router;
