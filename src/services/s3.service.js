'use strict';

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fileType = require('file-type');
const { getS3Config } = require('../configs/s3.config');
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer'); // CJS
require('dotenv').config();

let config = {};
const credentialConfig = getS3Config?.credential;
// Get config s3 image
const s3Config = getS3Config?.s3;
if (process.env.APP_ENV === 'dev') {
  config = {
    credentials: {
      accessKeyId: credentialConfig.key,
      secretAccessKey: credentialConfig.secret,
    },
  };
}

const s3Client = new S3Client({
  region: s3Config.region,
  ...config,
});

const putItemImageInBucket = async (pathFileName, filename, content) => {
  const contentType = await fileType.fromBuffer(content);
  const mime = filename
    .substring(filename.lastIndexOf('.') + 1, filename.length)
    .toUpperCase();
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    ContentType: contentType.mime,
    Body: content,
  });
  try {
    await s3Client.send(command);
  } catch (err) {
    throw err;
  }

  // have cloudfront url export
  const signedUrl = getSignedUrl({
    url: `${s3Config.baseUrl}/${filename}`,
    keyPairId: process.env.AWS_BUCKET_PUBLIC_KEY_ID,
    dateLessThan: new Date(Date.now() + 1000 * 60), //hết hạn 60s
    privateKey: process.env.AWS_BUCKET_PRIVATE_KEY_ID,
  });

  return {
    filename: `${pathFileName}.${mime}`.toLowerCase(),
    completedUrl: signedUrl,
    baseUrl: s3Config.baseUrl,
    mime,
  };
};

module.exports = {
  putItemImageInBucket,
};
