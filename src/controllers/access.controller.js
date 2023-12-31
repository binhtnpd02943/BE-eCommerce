'use strict';

const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  sigUp = async (req, res, next) => {
    new CREATED({
      message: 'Registered OK!',
      metadata: await AccessService.sigUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout Success',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  handlerRefreshToken = async (req, res, next) => {
    // V2 FIX, no need accessToken
    new SuccessResponse({
      message: 'Get token Success',
      metadata: await AccessService.handlerRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();
