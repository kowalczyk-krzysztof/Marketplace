import express, { Router } from 'express';
import {
  deleteUser,
  getUsers,
  getUser,
  updateUser,
} from '../controllers/admin';
import { authorize, protect } from '../middleware/auth';

const adminRouter: Router = express.Router();

adminRouter.route('/users').get(protect, authorize('ADMIN'), getUsers);
adminRouter
  .route('/users/:id')
  .delete(protect, authorize('ADMIN'), deleteUser)
  .get(protect, authorize('ADMIN'), getUser)
  .put(protect, authorize('ADMIN'), updateUser);

export default adminRouter;