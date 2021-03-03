import express, { Router } from 'express';
import { protect } from '../middleware/auth';
import { myCartExists } from '../middleware/myCartExists';
import {
  getMyCart,
  addItemToCart,
  deleteProductFromCart,
} from '../controllers/cart';

const cartRouter: Router = express.Router();
// All cart functionality is based on protect and cartExists middleware, they're necessary for each and every route!
cartRouter.route('/mycart').get(protect, myCartExists, getMyCart);
cartRouter.route('/add/:id').get(protect, myCartExists, addItemToCart);
cartRouter
  .route('/mycart/delete/:id')
  .put(protect, myCartExists, deleteProductFromCart);

export default cartRouter;
