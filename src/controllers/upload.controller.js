'use strict';

const { BadRequestError } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
  uploadImageFromLocalS3,
} = require('../services/upload.service');

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: 'uploadImageFromUrl success!',
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError('File missing');
    }
    new SuccessResponse({
      message: 'uploadImageFromUrl success!',
      metadata: await uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };

  uploadFileThumbFiles = async (req, res, next) => {
    const { files } = req;
    if (!files.length) {
      throw new BadRequestError('File missing');
    }
    new SuccessResponse({
      message: 'uploadFileThumbFiles success!',
      metadata: await uploadImageFromLocalFiles({
        files,
      }),
    }).send(res);
  };

  uploadFileS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError('File missing');
    }
    new SuccessResponse({
      message: 'Upload image use s3 successfully!',
      metadata: await uploadImageFromLocalS3({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
