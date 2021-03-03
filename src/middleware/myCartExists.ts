// Check if cart exists for logged in user, if not, creates cart
import { Request, Response, NextFunction } from 'express';
import asynchandler from 'express-async-handler';
import Cart from '../models/Cart';

export const myCartExists = asynchandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const checkCart = await Cart.findOne({ owner: res.locals.user.id });
    let createdCart = checkCart;
    if (!checkCart)
      createdCart = await Cart.create({ owner: res.locals.user.id });
    res.locals.cart = createdCart;
    next();
  }
);
