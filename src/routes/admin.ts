import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserCart,
} from '../controllers/admin';
import { roles } from '../middleware/roles';
import passport from 'passport';
import '../config/passport'; // importing passport settings

const adminRouter = express.Router();

adminRouter
  .route('/users/all')
  .get(
    passport.authenticate('jwt', { session: false }),
    roles('ADMIN'),
    getAllUsers
  );
adminRouter
  .route('/users/user/:id')
  .delete(
    passport.authenticate('jwt', { session: false }),
    roles('ADMIN'),
    deleteUser
  )
  .get(
    passport.authenticate('jwt', { session: false }),
    roles('ADMIN'),
    getUser
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    roles('ADMIN'),
    updateUser
  );
adminRouter
  .route('/users/cart/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    roles('ADMIN'),
    getUserCart
  );

export default adminRouter;
