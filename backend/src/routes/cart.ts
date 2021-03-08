import express, { Router } from 'express';
import {
  getMyCart,
  addProductToCart,
  addManyProductsToCart,
  deleteProductFromCart,
  deleteManyProductFromCart,
  emptyCart,
} from '../controllers/cart';
import passport from 'passport';
import '../config/passport'; // importing passport settings

const cartRouter: Router = express.Router();

cartRouter
  .route('/mycart/get')
  .get(passport.authenticate('jwt', { session: false }), getMyCart);
cartRouter
  .route('/mycart/addmany')
  .put(passport.authenticate('jwt', { session: false }), addManyProductsToCart);
cartRouter
  .route('/mycart/add/:id')
  .put(passport.authenticate('jwt', { session: false }), addProductToCart);
cartRouter
  .route('/mycart/deletemany')
  .put(
    passport.authenticate('jwt', { session: false }),
    deleteManyProductFromCart
  );
cartRouter
  .route('/mycart/delete/:id')
  .put(passport.authenticate('jwt', { session: false }), deleteProductFromCart);
cartRouter
  .route('/mycart/empty')
  .put(passport.authenticate('jwt', { session: false }), emptyCart);

export default cartRouter;
