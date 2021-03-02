import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart';

// @desc    Get cart of logged in user
// @route   GET /api/v1/cart/mycart
// @access  Private
export const getMyCart: RequestHandler = asyncHandler(
  async (req, res): Promise<void> => {
    // const cart = await Cart.findById(req.body.id);
    // const allProducts = await Promise.all(
    //   cart.product.map(async (el) => {
    //     return await Product.findById(el);
    //   })

    // Above is my original implementation before I found out about populate()

    // This is called REFERENCING documents - it queries for every single document, there's an another approach called EMBEDDED documents but I don't think it's a good approach for a cart

    // If cart has no products send emptyCartMsg
    const cartEmpty = await Cart.findOne({ owner: req.user.id });
    if (!cartEmpty?.product[0]) {
      await Cart.findOne({ owner: req.user.id });
      res.status(200).json({
        success: true,
        data: 'Your cart is empty',
      });
    } else {
      const cart = await Cart.findOne({ owner: req.user.id }).populate(
        'product',
        'name pricePerUnit stock description addedBy'
      );
      res.status(200).json({
        success: true,
        data: cart,
      });
    }
  }
);
// @desc    Add product to cart
// @route   GET /api/v1/cart/add/:id
// @access  Private
export const addItemToCart: RequestHandler = asyncHandler(
  async (req, res): Promise<void> => {
    const cart = await Cart.findOne({ owner: req.user.id });

    cart?.product.addToSet(req.params.id);
    cart?.save();

    if (cart?.isModified('product') === false)
      res.status(400).json({
        success: true,
        data: `You already have product with id of ${req.params.id} in your cart`,
      });
    else
      res.status(201).json({
        success: true,
        data: `Added product with id of ${req.params.id} to cart`,
      });
  }
);
