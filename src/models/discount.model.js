'use strict';
const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      require: true,
    },
    discount_description: {
      type: String,
      require: true,
    },
    discount_type: {
      type: String,
      default: 'fixed_amount',
    },
    discount_value: {
      type: Number,
      require: true,
    },
    // discount code
    discount_code: {
      type: String,
      require: true,
    },
    // ngay bat dau
    discount_start_date: {
      type: Date,
      require: true,
    },
    // ngay ket thuc
    discount_end_date: {
      type: Date,
      require: true,
    },
    // so luong discount duoc ap dung
    discount_max_uses: {
      type: Number,
      require: true,
    },
    // ai đã sử dụng
    discount_users_used: {
      type: Array,
      default: [],
    },
    discount_uses_count: {
      type: Number,
      require: true,
    },
    // số lượng cho phép tối đã mỗi user
    discount_max_uses_per_user: {
      type: Number,
      require: true,
    },
    discount_min_oder_value: {
      type: Number,
      require: true,
    },
    // số discount đã sử dụng
    discount_max_value: {
      type: Number,
      require: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      require: true,
      enum: ['all', 'specific'],
    },
    // số sản phẩm được áp dụng
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema),
};
