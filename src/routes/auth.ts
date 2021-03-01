import express, { Router } from 'express';
import {
  deleteUser,
  getUsers,
  getMe,
  login,
  register,
  getUser,
  updateNameAndEmail,
  updateUser,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/auth';
import { authorize, protect } from '../middleware/auth';

const userRouter: Router = express.Router();

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/me').get(protect, getMe);
userRouter.route('/users').get(protect, authorize('admin'), getUsers);
userRouter.route('/changedetails').put(protect, updateNameAndEmail);
userRouter.route('/updatepassword').put(protect, updatePassword);
userRouter
  .route('/users/:id')
  .delete(protect, authorize('admin'), deleteUser)
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser);
userRouter.route('/forgotpassword').post(forgotPassword);
userRouter.route('/resetpassword/:resettoken').put(resetPassword);

export default userRouter;
