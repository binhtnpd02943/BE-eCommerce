'use strict';

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const uploadController = require('../../controllers/upload.controller');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config');
const router = express.Router();

// authentication
// router.use(authentication);

router.post('/product', asyncHandler(uploadController.uploadFile));
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  asyncHandler(uploadController.uploadFileThumb)
);
router.post(
  '/product/multiple',
  uploadDisk.any('files', 3),
  asyncHandler(uploadController.uploadFileThumbFiles)
);

// upload s3
router.post(
  '/product/bucket',
  uploadMemory.single('file'),
  asyncHandler(uploadController.uploadFileS3)
);

module.exports = router;
