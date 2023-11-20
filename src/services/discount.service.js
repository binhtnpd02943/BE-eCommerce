'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { discount } = require('../models/discount.model');
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
} = require('../models/repositories/discount.repository');
const {
  findAllProducts,
} = require('../models/repositories/product.repository');

/*
Discount Service
1 - Generator Discount code [Shop | Admin]
2 - Get discount amount [User]
3 - Get all discount codes [User | Shop]
4 - Verify discount code [User]
5 - Delete discount code [Admin | Shop]
6 - Cancel discount code [User]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload;
    // check
    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end_date');
    }

    // Create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exists!');
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_users_used: users_used,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_oder_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscount() {}

  //   Get all discount codes available with products
  static async getAllDiscountCodesWithProduct({
    codeId,
    shopId,
    userId,
    limit,
    page,
  }) {
    // Create index for discount code
    const foundDiscount = await checkDiscountExist({
      filter: {
        discount_code: codeId,
        discount_shopId: shopId,
      },
      model: discount,
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exists!');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === 'all') {
      // get all products
      products = await findAllProducts({
        filter: {
          product_shop: shopId,
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    if (discount_applies_to === 'specific') {
      // get the products ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    return products;
  }

  // Get all discount code of shop
  static async getAllDiscountCodesByShop({ shopId, limit, page }) {
    const discounts = await findAllDiscountCodesUnSelect({
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      limit: +limit,
      page: +page,
      unSelect: ['__v', 'discount_shopId'],
      model: discount,
    });
    return discounts;
  }

  //   Apply Discount code
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExist({
      filter: {
        discount_code: codeId,
        discount_shopId: shopId,
      },
      model: discount,
    });

    if (!foundDiscount) throw new BadRequestError(`Discount does'n exists!`);

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_oder_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError(`Discount expired!`);
    if (!discount_max_uses) throw new NotFoundError(`Discount are out!`);

    // check
    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestError('Start date must be before end_date');
    }

    // check xem co set gia tri toi thieu hay khong?
    let totalOrder = 0;
    if (discount_min_oder_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      if (totalOrder < discount_min_oder_value) {
        throw new BadRequestError(
          `Discount requires a minium order value of ${discount_min_oder_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );

      if (userUseDiscount) {
        // ...
      }
    }

    // check xem discount nay là fixed_amount hay là specific
    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  //   Delete discount code
  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findByIdAndDelete({
      discount_code: codeId,
      discount_shopId: shopId,
    });

    return deleted;
  }

  //   Cancel discount code
  static async cancelDiscountCode({ shopId, codeId, userId }) {
    const foundDiscount = await checkDiscountExist({
      filter: {
        discount_code: codeId,
        discount_shopId: shopId,
      },
      model: discount,
    });
    if (!foundDiscount) throw new BadRequestError(`Discount does'n exists!`);

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }
}

module.exports = DiscountService;
