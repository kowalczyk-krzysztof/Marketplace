import express, { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserCart,
  addCategory,
} from '../controllers/admin';
import passport from 'passport';
import '../config/passport'; // importing passport settings

const adminRouter: Router = express.Router();

adminRouter
  .route('/users/all')
  .get(passport.authenticate('jwt', { session: false }), getAllUsers);
adminRouter
  .route('/users/user/:id')
  .delete(passport.authenticate('jwt', { session: false }), deleteUser)
  .get(passport.authenticate('jwt', { session: false }), getUser)
  .put(passport.authenticate('jwt', { session: false }), updateUser);
adminRouter
  .route('/users/cart/:id')
  .get(passport.authenticate('jwt', { session: false }), getUserCart);
adminRouter
  .route('/categories/add')
  .post(passport.authenticate('jwt', { session: false }), addCategory);

export default adminRouter;
