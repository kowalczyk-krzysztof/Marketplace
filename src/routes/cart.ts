import express from 'express';
import { protect } from '../middleware/auth';
import {
  getMyCart,
  addProductToCart,
  deleteProductFromCart,
  emptyCart,
  addManyProducts,
} from '../controllers/cart';

const cartRouter = express.Router();
// All cart functionality is based on protect and cartExists middleware, they're necessary for each and every route!
cartRouter.route('/mycart').get(protect, getMyCart);
cartRouter.route('/mycart/add').put(protect, addManyProducts);
cartRouter.route('/add/:id').put(protect, addProductToCart);
cartRouter.route('/mycart/delete').put(protect, deleteProductFromCart);
cartRouter.route('/mycart/empty').put(protect, emptyCart);

export default cartRouter;
