import express, { Router } from 'express';
import {
  getProducts,
  getProduct,
  getMerchantFromProductId,
  getProductsByMerchant,
  createProduct,
  deleteProduct,
  updateProduct,
  productFileUpload,
} from '../controllers/product';
import { protect, authorize } from '../middleware/auth';

const productRouter: Router = express.Router();

productRouter.route('/').get(getProducts);
productRouter.route('/:id').get(getProduct);
productRouter.route('/:id/merchant').get(getMerchantFromProductId);
productRouter
  .route('/manage')
  .post(protect, authorize('MERCHANT', 'ADMIN'), createProduct);

productRouter
  .route('/manage/:id')
  .put(protect, authorize('MERCHANT', 'ADMIN'), updateProduct)
  .delete(protect, authorize('MERCHANT', 'ADMIN'), deleteProduct);

productRouter
  .route('/manage/:id/photo')
  .put(protect, authorize('MERCHANT', 'ADMIN'), productFileUpload);
productRouter.route('/merchant/:id').get(getProductsByMerchant);

export default productRouter;
