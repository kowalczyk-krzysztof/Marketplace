import express, { Router } from 'express';
import passport from 'passport';

import {
  fuzzySearch,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMerchantFromProductId,
  getProductsByMerchant,
  productFileUpload,
} from '../controllers/product';
import '../config/passport'; // importing passport settings

const productRouter: Router = express.Router();
productRouter.route('/find/search').get(fuzzySearch);
productRouter.route('/find/product/:id').get(getProduct);
productRouter
  .route('/find/merchant/productid/:id')
  .get(getMerchantFromProductId);
productRouter
  .route('/manage/create')
  .post(passport.authenticate('jwt', { session: false }), createProduct);

productRouter
  .route('/manage/edit/:id')
  .put(passport.authenticate('jwt', { session: false }), updateProduct);
productRouter
  .route('/manage/delete/:id')
  .delete(passport.authenticate('jwt', { session: false }), deleteProduct);

productRouter
  .route('/manage/photo/:id')
  .put(passport.authenticate('jwt', { session: false }), productFileUpload);

productRouter.route('/find/merchant/products/:id').get(getProductsByMerchant);

export default productRouter;
