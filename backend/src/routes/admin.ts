import express, { Router } from 'express';
import passport from 'passport';

import {
  getAllProducts,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserCart,
  addCategory,
  deleteCategory,
  getAllCategories,
} from '../controllers/admin';
import '../config/passport'; // importing passport settings

const adminRouter: Router = express.Router();

adminRouter
  .route('/products')
  .get(passport.authenticate('jwt', { session: false }), getAllProducts);
adminRouter
  .route('/users/all')
  .get(passport.authenticate('jwt', { session: false }), getAllUsers);
adminRouter
  .route('/users/user/:id')
  .delete(passport.authenticate('jwt', { session: false }), deleteUser)
  .put(passport.authenticate('jwt', { session: false }), updateUser);
adminRouter
  .route('/users/cart/:id')
  .get(passport.authenticate('jwt', { session: false }), getUserCart);
adminRouter
  .route('/categories/add')
  .post(passport.authenticate('jwt', { session: false }), addCategory);
adminRouter
  .route('/categories/delete/:id')
  .delete(passport.authenticate('jwt', { session: false }), deleteCategory);

adminRouter
  .route('/categories/list')
  .get(passport.authenticate('jwt', { session: false }), getAllCategories);

export default adminRouter;
