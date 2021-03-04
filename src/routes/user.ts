import express from 'express';
import {
  register,
  login,
  logout,
  getMyProfile,
  updateNameAndEmail,
  updatePassword,
  forgotPassword,
  resetPassword,
  userPhotoUpload,
  myCreatedProducts,
  verifyEmail,
  resendVerifyEmail,
} from '../controllers/user';
import { protect } from '../middleware/auth';

const userRouter = express.Router();

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/logout').post(logout);
userRouter.route('/profile').get(protect, getMyProfile);
userRouter.route(`/profile/products`).get(protect, myCreatedProducts);
userRouter.route('/profile/updatepassword').put(protect, updatePassword);
userRouter.route('/profile/changedetails').put(protect, updateNameAndEmail);
userRouter.route('/profile/photo').put(protect, userPhotoUpload);
userRouter.route('/forgotpassword').put(forgotPassword);
userRouter.route('/resetpassword/:resettoken').put(resetPassword);
userRouter.route('/verifyemail/:resettoken').put(verifyEmail);
userRouter.route('/resendverifyemail').put(resendVerifyEmail);

export default userRouter;
