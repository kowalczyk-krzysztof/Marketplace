import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import { ErrorResponse } from '../utils/ErrorResponse';
import Cart from '../models/Cart';
import User from '../models/User';

// @desc    Get cart of logged in user
// @route   GET /api/v1/cart/mycart
// @access  Private
export const getMyCart: RequestHandler = asyncHandler(async (req, res) => {
  // const cart = await Cart.findById(req.body.id);
  // const allProducts = await Promise.all(
  //   cart.product.map(async (el) => {
  //     return await Product.findById(el);
  //   })

  // Above is my original implementation before I found out about populate()

  // This is called REFERENCING documents it queries for every single document, there's an another approach called EMBEDDED documents but I don't think it's a good approach for a cart

  // Checks if user has a cart, if not, it creates one
  const cartExists = await Cart.findOne({ owner: req.user.id });
  const emptyCartMsg = 'Your cart is empty';

  if (!cartExists) {
    await Cart.create({ owner: req.user.id });
    res.status(200).json({
      success: true,
      data: emptyCartMsg,
    });
  }
  // If cart has no products send emptyCartMsg
  else if (!cartExists.product[0]) {
    await Cart.findOne({ owner: req.user.id });
    res.status(200).json({
      success: true,
      data: emptyCartMsg,
    });
  } else {
    const cart = await Cart.findOne({ owner: req.user.id }).populate('product');

    res.status(200).json({
      success: true,
      data: cart,
    });
  }
});
