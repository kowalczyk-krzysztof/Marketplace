import express, { Router } from 'express';
import {
  deleteUser,
  getUsers,
  getUser,
  updateUser,
} from '../controllers/admin';
import { authorize, protect } from '../middleware/auth';

const adminRouter: Router = express.Router();

adminRouter.route('/users').get(protect, authorize('admin'), getUsers);
adminRouter
  .route('/users/:id')
  .delete(protect, authorize('admin'), deleteUser)
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser);

export default adminRouter;
