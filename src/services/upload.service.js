'use strict';

const cloudinary = require('../configs/cloudinary.config');
const mime = require('mime-types');
const { create_UUID } = require('../helpers/uuid.helper');
const { putItemImageInBucket } = require('./s3.service');

// upload file use S3Client //
// 4. upload from image local s3
const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const nameFile = Buffer.from(
      file.originalname.substring(0, file.originalname.lastIndexOf('.')),
      'binary'
    );
    const fileType = mime.extension(file.mimetype).toString();
    const fileName = `${create_UUID()}.${fileType}`;
    const aws = await putItemImageInBucket(nameFile, fileName, file.buffer);
    return aws;
  } catch (error) {
    console.error(error);
  }
};
// END S3 Service //

// 1. Upload form url image
const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      'https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/383228321_3524553057793932_8696815263695829363_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=f99tJSuJwRkAX8y7uzj&_nc_ht=scontent.fdad3-6.fna&oh=00_AfDzfRwm5SfksDWYS2IXOIB7xpbYH02mSfleV9s6mE4ACw&oe=6567D8E6';
    const folderName = 'product/1001',
      newFileName = 'testDemo';

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
    });

    console.log(`result upload`, result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

// 2. Upload from image local
const uploadImageFromLocal = async ({ path, folderName = 'product/1001' }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName,
    });

    return {
      image_url: result.secure_url,
      shopId: 1001,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg',
      }),
    };
  } catch (error) {
    console.error(error);
  }
};

// 3. Upload from image local
const uploadImageFromLocalFiles = async ({
  files,
  folderName = 'product/1001',
}) => {
  try {
    if (!files.length) return;

    const uploadedUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });

      uploadedUrls.push({
        image_url: result.secure_url,
        shopId: 1001,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: 'jpg',
        }),
      });
    }

    return uploadedUrls;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
  uploadImageFromLocalS3,
};
