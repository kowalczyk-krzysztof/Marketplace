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
import { protect, authorize } from '../middleware/auth';

const productRouter = express.Router();

productRouter.route('/find/allproducts').get(getManyProducts);
productRouter.route('/find/product/:id').get(getProduct);
productRouter
  .route('/find/merchant/productid/:id')
  .get(getMerchantFromProductId);
productRouter
  .route('/manage/create')
  .post(protect, authorize('MERCHANT', 'ADMIN'), createProduct);

productRouter
  .route('/manage/edit/:id')
  .put(protect, authorize('MERCHANT', 'ADMIN'), updateProduct);
productRouter
  .route('/manage/delete/:id')
  .delete(protect, authorize('MERCHANT', 'ADMIN'), deleteProduct);

productRouter
  .route('/manage/photo/:id')
  .put(protect, authorize('MERCHANT', 'ADMIN'), productFileUpload);
productRouter.route('/find/merchant/products/:id').get(getProductsByMerchant);

export default productRouter;
