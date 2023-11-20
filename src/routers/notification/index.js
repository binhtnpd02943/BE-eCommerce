'use strict';

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const commentController = require('../../controllers/comment.controller');
const { authentication } = require('../../auth/authUtils');
const notificationController = require('../../controllers/notification.controller');
const router = express.Router();

// Here not login

// authentication
router.use(authentication);

router.get('', asyncHandler(notificationController.listNotiByUser));

module.exports = router;
