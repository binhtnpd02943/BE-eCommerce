'use strict';

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();

router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProducts)
);

router.get('/', asyncHandler(productController.getAllProducts));
router.get('/:product_id', asyncHandler(productController.findProduct));

// authentication
router.use(authentication);
// create product
router.post('', asyncHandler(productController.createProduct));
// update product
router.patch('/:productId', asyncHandler(productController.updateProduct));

router.post(
  '/publish/:id',
  asyncHandler(productController.publishProductByShop)
);
router.post(
  '/unPublish/:id',
  asyncHandler(productController.unPublishProductByShop)
);

//  QUERY //
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));
router.get(
  '/published/all',
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
