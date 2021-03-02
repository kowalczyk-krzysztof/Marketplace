// Check if cart exists for logged in user, if not, creates cart
import asynchandler from 'express-async-handler';
import Cart from '../models/Cart';

export const cartExists = asynchandler(
  async (req, res, next): Promise<void> => {
    const checkCart = await Cart.findOne({ owner: req.user.id });

    if (!checkCart) await Cart.create({ owner: req.user.id });
    next();
  }
);
