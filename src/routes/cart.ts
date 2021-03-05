import express from 'express';
import { protect } from '../middleware/auth';
import {
  getMyCart,
  addProductToCart,
  addManyProductsToCart,
  deleteProductFromCart,
  deleteManyProductFromCart,
  emptyCart,
} from '../controllers/cart';

const cartRouter = express.Router();
// All cart functionality is based on protect and cartExists middleware, they're necessary for each and every route!
cartRouter.route('/mycart/get').get(protect, getMyCart);
cartRouter.route('/mycart/addmany').put(protect, addManyProductsToCart);
cartRouter.route('/mycart/add/:id').put(protect, addProductToCart);
cartRouter.route('/mycart/deletemany').put(protect, deleteManyProductFromCart);
cartRouter.route('/mycart/delete/:id').put(protect, deleteProductFromCart);
cartRouter.route('/mycart/empty').put(protect, emptyCart);

export default cartRouter;
