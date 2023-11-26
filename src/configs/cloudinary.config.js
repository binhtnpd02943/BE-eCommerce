'use strict';

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: process.env.CLOUDDINARY_NAME,
  api_key: process.env.CLOUDDINARY_API_KEY,
  api_secret: process.env.CLOUDDINARY_API_SECRET,
});

module.exports = cloudinary;
