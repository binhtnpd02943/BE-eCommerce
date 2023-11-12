'use strict';

const { NotFoundError } = require('../core/error.response');
const { cart } = require('../models/cart.model');
const { getProductById } = require('../models/repositories/product.repository');

/*
Cart Service: Key features 
1 - Add product to cart [User]
2 - Reduce product quantity by one [User]
3 - Increase product quantity by one [User]
4 - Get cart [User]
5 - Delete cart [User]
6 - Delete cart item [User]
*/

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active',
      },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': quantity,
        },
      },
      options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCart({ userId, product = {} }) {
    const { productId } = product;
    // check cart ton tai hay khong?
    const userCart = await cart.findOne({
      cart_userId: userId,
    });

    // check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError('Product not found!');

    const bodyProduct = {
      ...product,
      product_name: foundProduct.product_name,
      product_price: foundProduct.product_price,
    };

    if (!userCart) {
      // create cart to user
      return await CartService.createUserCart({
        userId,
        product: bodyProduct,
      });
    }

    // nếu có cart rồi nhưng chưa có sản phẩm
    if (!userCart.cart_products.length) {
      userCart.cart_products = [bodyProduct];
      return await userCart.save();
    }

    // nếu giỏ hàng tồn tại và có sản phẩm thì update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  // update
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    // check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError('Product not found!');
    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product do not belong to the shop!');
    }

    if (quantity === 0) {
      // deleted
      return await CartService.deleteUserCart({
        userId,
        productId,
      });
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };

    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
