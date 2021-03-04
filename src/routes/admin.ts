import express, { Router } from 'express';
import {
  deleteUser,
  getUsers,
  getUser,
  updateUser,
  getUserCart,
} from '../controllers/admin';
import { authorize, protect } from '../middleware/auth';

const adminRouter: Router = express.Router();
// Protect and authorize middleware is necessary for admin routes to work properly
adminRouter.route('/users').get(protect, authorize('ADMIN'), getUsers);
adminRouter
  .route('/users/:id')
  .delete(protect, authorize('ADMIN'), deleteUser)
  .get(protect, authorize('ADMIN'), getUser)
  .put(protect, authorize('ADMIN'), updateUser);
adminRouter
  .route('/users/cart/:id')
  .get(protect, authorize('ADMIN'), getUserCart);

export default adminRouter;
