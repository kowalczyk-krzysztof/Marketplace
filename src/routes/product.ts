import express, { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from '../controllers/product';
import { protect, authorize } from '../middleware/auth';

const productRouter: Router = express.Router();

productRouter
  .route('/')
  .get(getProducts)
  .post(protect, authorize('seller', 'admin'), createProduct);

productRouter
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('seller', 'admin'), updateProduct)
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

export default productRouter;
