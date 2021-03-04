import express, { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  getMyCart,
  addProductToCart,
  deleteProductFromCart,
  emptyCart,
} from '../controllers/cart';

const cartRouter: Router = express.Router();
// All cart functionality is based on protect and cartExists middleware, they're necessary for each and every route!
cartRouter.route('/mycart').get(protect, getMyCart);
cartRouter.route('/add/:id').put(protect, addProductToCart);
cartRouter.route('/mycart/delete/:id').put(protect, deleteProductFromCart);
cartRouter.route('/mycart/empty').put(protect, emptyCart);

export default cartRouter;
