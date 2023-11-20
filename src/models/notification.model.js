'use strict';
const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// ORDER-001: order successful
// ORDER-002: order failed
// PROMOTION-001: new PROMOTION
// SHOP-001: new product by User following

const notificationSchema = new Schema(
  {
    notification_type: {
      type: String,
      enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
      require: true,
    },
    notification_receivedId: {
      type: Number,
      require: true,
    },
    notification_senderId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      require: true,
    },
    notification_content: {
      type: String,
      require: true,
    },
    notification_options: {
      type: Object,
      default: {},
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);
