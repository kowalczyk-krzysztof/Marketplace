import express from 'express';
import {
  getProduct,
  getManyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMerchantFromProductId,
  getProductsByMerchant,
  productFileUpload,
} from '../controllers/product';
import { roles } from '../middleware/roles';
import passport from 'passport';
import '../config/passport'; // importing passport settings

const productRouter = express.Router();

productRouter.route('/find/allproducts').get(getManyProducts);
productRouter.route('/find/product/:id').get(getProduct);
productRouter
  .route('/find/merchant/productid/:id')
  .get(getMerchantFromProductId);
productRouter
  .route('/manage/create')
  .post(
    passport.authenticate('jwt', { session: false }),
    roles('MERCHANT', 'ADMIN'),
    createProduct
  );

productRouter
  .route('/manage/edit/:id')
  .put(
    passport.authenticate('jwt', { session: false }),
    roles('MERCHANT', 'ADMIN'),
    updateProduct
  );
productRouter
  .route('/manage/delete/:id')
  .delete(
    passport.authenticate('jwt', { session: false }),
    roles('MERCHANT', 'ADMIN'),
    deleteProduct
  );

productRouter
  .route('/manage/photo/:id')
  .put(
    passport.authenticate('jwt', { session: false }),
    roles('MERCHANT', 'ADMIN'),
    productFileUpload
  );
productRouter.route('/find/merchant/products/:id').get(getProductsByMerchant);

export default productRouter;
