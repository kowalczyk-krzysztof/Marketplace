import express, { Router } from 'express';
import fileUpload from 'express-fileupload';
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductsByMerchant,
  productFileUpload,
} from '../controllers/product';
import { protect, authorize } from '../middleware/auth';

const productRouter: Router = express.Router();

productRouter.route('/').get(getProducts);
productRouter
  .route('/manage')
  .post(protect, authorize('MERCHANT', 'ADMIN'), createProduct);

productRouter
  .route('/manage/:id')
  .get(getProduct)
  .put(protect, authorize('MERCHANT', 'ADMIN'), updateProduct)
  .delete(protect, authorize('MERCHANT', 'ADMIN'), deleteProduct);

productRouter
  .route('/manage/:id/photo')
  .put(protect, authorize('MERCHANT', 'ADMIN'), productFileUpload);
productRouter.route('/merchant/:id').get(getProductsByMerchant);

export default productRouter;
