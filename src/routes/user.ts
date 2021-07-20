import express, { Router } from 'express';
import passport from 'passport';

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
  getUser,
} from '../controllers/user';
import '../config/passport'; // importing passport settings

const userRouter: Router = express.Router();

userRouter
  .route('/register')
  .post(passport.authenticate('register', { session: false }), register);
userRouter
  .route('/login')
  .post(passport.authenticate('login', { session: false }), login);
userRouter.route('/logout').get(logout);
userRouter
  .route('/profile')
  .get(passport.authenticate('jwt', { session: false }), getMyProfile);
userRouter
  .route(`/profile/products`)
  .get(passport.authenticate('jwt', { session: false }), myCreatedProducts);
userRouter
  .route('/profile/updatepassword')
  .put(passport.authenticate('jwt', { session: false }), updatePassword);
userRouter
  .route('/profile/changedetails')
  .put(passport.authenticate('jwt', { session: false }), updateNameAndEmail);
userRouter
  .route('/profile/photo')
  .put(passport.authenticate('jwt', { session: false }), userPhotoUpload);
userRouter.route('/forgotpassword').put(forgotPassword);
userRouter.route('/resetpassword/:resettoken').put(resetPassword);
userRouter.route('/verifyemail/:resettoken').put(verifyEmail);
userRouter
  .route('/profile/resendverifyemail')
  .get(passport.authenticate('jwt', { session: false }), resendVerifyEmail);
userRouter.route('/user/:id').get(getUser);

export default userRouter;
