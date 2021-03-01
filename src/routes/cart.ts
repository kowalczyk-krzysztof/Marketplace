import express, { Router } from 'express';
import { protect } from '../middleware/auth';
import { cartExists } from '../middleware/cartExists';
import { getMyCart, addItemToCart } from '../controllers/cart';

const cartRouter: Router = express.Router();
// All cart functionality is based on protect and cartExists middleware, they're necessary for each and every route!
cartRouter.route('/mycart').get(protect, cartExists, getMyCart);
cartRouter.route('/add').post(protect, cartExists, addItemToCart);

export default cartRouter;
