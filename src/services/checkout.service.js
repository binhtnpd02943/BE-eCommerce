'use strict';

const { NotFoundError, BadRequestError } = require('../core/error.response');
const { findCartById } = require('../models/repositories/cart.repositoty');
const {
  checkDataProductServer,
  checkProductByServer,
} = require('../models/repositories/product.repository');
const DiscountService = require('./discount.service');

class CheckoutService {
  /* 
    {
        cartId,
        userId,
        shop_order_ids:[
            {
                shopId,
                shop_discounts:[],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            },
             {
                shopId,
                shop_discounts:[{
                    shopId,
                    discountId,
                    codeId
                }],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
        ]
    }
    */
  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    // check cartId ton tai khong?
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new NotFoundError('Cart dose not exists!');

    const checkout_order = {
        totalPrice: 0, // tổng tiền hàng
        feeShip: 0, // phí vận chuyển
        totalDiscount: 0, // tổng tiền discount giảm giá
        totalCheckout: 0, // tổng thanh toán
      },
      shop_order_ids_new = [];

    //  tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      //  check product available
      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) throw new BadRequestError('order wrong!');

      //   tong tiền đơn hàng
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price);
      }, 0);

      //   tổng tiền trước khi xử lý
      checkout_order.totalPrice =+ checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      //   neu shop_discounts ton tai > 0, check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        // giả sử chỉ có 1 discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmount({
            codeId: shop_discounts[0].codeId,
            userId,
            shopId,
            products: checkProductServer,
          });

        //   tổng cộng discount giảm giá
        checkout_order.totalDiscount += discount;

        // nếu tiền giảm giá > 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      //   tổng thanh toán cuối cùng
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }
}

module.exports = CheckoutService;
