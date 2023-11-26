'use strict';

const getAwsConfig = () => ({
  credential: {
    key: process.env.AWS_BUCKET_ACCESS_KEY,
    secret: process.env.AWS_BUCKET_SECRET_KEY,
  },
  s3: {
    bucket: process.env.AWS_BUCKET_NAME ?? 'shopdev-binhtn',
    region: process.env.AWS_S3_REGION,
    baseUrl: process.env.AWS_STORAGE_URL,
  },
  ses: {
    region: process.env.AWS_SES_REGION,
  },
});

module.exports = {
  getS3Config: getAwsConfig(),
};
