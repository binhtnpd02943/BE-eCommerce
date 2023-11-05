'use strict';

const { CREATED } = require('../core/success.response');
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
}

module.exports = new AccessController();
