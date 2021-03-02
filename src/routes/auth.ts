import express, { Router } from 'express';
import {
  getMe,
  login,
  logout,
  register,
  updateNameAndEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
  userPhotoUpload,
} from '../controllers/user';
import { protect } from '../middleware/auth';

const userRouter: Router = express.Router();

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/logout').get(logout);
userRouter.route('/me').get(protect, getMe);
userRouter.route('/changedetails').put(protect, updateNameAndEmail);
userRouter.route('/photo').put(protect, userPhotoUpload);
userRouter.route('/updatepassword').put(protect, updatePassword);
userRouter.route('/forgotpassword').post(forgotPassword);
userRouter.route('/resetpassword/:resettoken').put(resetPassword);

export default userRouter;
