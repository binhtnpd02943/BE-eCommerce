'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// sigUp
router.post('/shop/sigUp', asyncHandler(accessController.sigUp));
// login
router.post('/shop/login', asyncHandler(accessController.login));

// authentication
router.use(authentication);
// logout
router.post('/shop/logout', asyncHandler(accessController.logout));
// refreshToken
router.post(
  '/shop/refreshToken',
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
