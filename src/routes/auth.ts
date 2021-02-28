import express, { Router } from 'express';
import {
  deleteUser,
  getUsers,
  getMe,
  login,
  register,
  getUser,
  updateMe,
  updateUser,
} from '../controllers/auth';
import { authorize, protect } from '../middleware/auth';

const userRouter: Router = express.Router();

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/me').get(protect, getMe).put(protect, updateMe);
userRouter.route('/users').get(protect, authorize('admin'), getUsers);
userRouter
  .route('/users/:id')
  .delete(protect, authorize('admin'), deleteUser)
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser);

export default userRouter;
