import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserCart,
} from '../controllers/admin';
import { authorize, protect } from '../middleware/auth';

const adminRouter = express.Router();
// Protect and authorize middleware is necessary for admin routes to work properly
adminRouter.route('/users/all').get(protect, authorize('ADMIN'), getAllUsers);
adminRouter
  .route('/users/user/:id')
  .delete(protect, authorize('ADMIN'), deleteUser)
  .get(protect, authorize('ADMIN'), getUser)
  .put(protect, authorize('ADMIN'), updateUser);
adminRouter
  .route('/users/cart/:id')
  .get(protect, authorize('ADMIN'), getUserCart);

export default adminRouter;
