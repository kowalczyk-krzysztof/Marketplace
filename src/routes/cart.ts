import express, { Router } from 'express';
import { getMyCart } from '../controllers/cart';
import { protect } from '../middleware/auth';

const cartRouter: Router = express.Router();

cartRouter.route('/mycart').get(protect, getMyCart);

export default cartRouter;
