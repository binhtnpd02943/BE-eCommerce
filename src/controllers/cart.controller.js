'use strict';

const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');
const CartService = require('../services/cart.service');

class CartController {
  /**
   * @desc add to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url /v1/api/cart/user
   */
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new cart successful!',
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  update = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new cart successful!',
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete cart successful!',
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  getAll = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all cart successful!',
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
