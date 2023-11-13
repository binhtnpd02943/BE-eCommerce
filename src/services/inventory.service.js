'use strict';

const { NotFoundError } = require('../core/error.response');
const { inventory } = require('../models/inventory.model');
const { getProductById } = require('../models/repositories/product.repository');

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = '41 nguyen van hue, Da Nang',
  }) {
    const product = await getProductById(productId);
    if (!product) throw new NotFoundError('The product dose not exist!');

    const query = { inventory_shopId: shopId, inventory_productId: productId };
    const updateSet = {
      $inc: {
        inventory_stock: stock,
      },
      $set: {
        inventory_location: location,
      },
    };
    const options = { upsert: true, new: true };

    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
