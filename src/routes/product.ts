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

productRouter.route('/').get(getManyProducts);
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
