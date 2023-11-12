'use strict';

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();

router.post('/add-cart', asyncHandler(cartController.addToCart));
router.delete('/delete', asyncHandler(cartController.delete));
router.post('/update', asyncHandler(cartController.update));
router.get('/', asyncHandler(cartController.getAll));

// authentication
router.use(authentication);

module.exports = router;
