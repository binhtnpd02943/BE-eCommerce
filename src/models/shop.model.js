'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

// Declare the Schema of the Mongo model
const shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 255,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    mobile: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inActive'],
      default: 'active',
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);
