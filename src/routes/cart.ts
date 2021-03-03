import express, { Router } from 'express';
import { protect } from '../middleware/auth';
import { myCartExists } from '../middleware/myCartExists';
import {
  getMyCart,
  addProductToCart,
  deleteProductFromCart,
  addManyProducts,
  emptyCart,
} from '../controllers/cart';

const cartRouter: Router = express.Router();
// All cart functionality is based on protect and cartExists middleware, they're necessary for each and every route!
cartRouter.route('/mycart').get(protect, myCartExists, getMyCart);
cartRouter.route('/add/').put(protect, myCartExists, addManyProducts);
cartRouter.route('/add/:id').put(protect, myCartExists, addProductToCart);
cartRouter
  .route('/mycart/delete/:id')
  .put(protect, myCartExists, deleteProductFromCart);
cartRouter.route('/mycart/empty').put(protect, myCartExists, emptyCart);

export default cartRouter;
