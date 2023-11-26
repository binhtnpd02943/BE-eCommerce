'use strict';

const { SuccessResponse } = require('../core/success.response');
const CheckoutService = require('../services/checkout.service');

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: 'Checkout success!',
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };

  orderByUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Order success!',
      metadata: await CheckoutService.orderByUser(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
