import express, { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductsByMerchant,
} from '../controllers/product';
import { protect, authorize } from '../middleware/auth';

const productRouter: Router = express.Router();

productRouter.route('/').get(getProducts);
productRouter
  .route('/manage')
  .post(protect, authorize('merchant', 'admin'), createProduct);

productRouter
  .route('/manage/:id')
  .get(getProduct)
  .put(protect, authorize('merchant', 'admin'), updateProduct)
  .delete(protect, authorize('merchant', 'admin'), deleteProduct);

productRouter.route('/merchant/:id').get(getProductsByMerchant);

export default productRouter;
