'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const router = express.Router();

// sigUp
router.post('/shop/sigUp', asyncHandler(accessController.sigUp));
// login
router.post('/shop/login', asyncHandler(accessController.login));

module.exports = router;
