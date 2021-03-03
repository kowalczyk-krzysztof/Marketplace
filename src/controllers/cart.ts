import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product';
import { ErrorResponse } from '../utils/ErrorResponse';

// @desc    Get cart of logged in user
// @route   GET /api/v1/cart/mycart
// @access  Private
export const getMyCart = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // This is called REFERENCING documents - it queries for every single document, there's an another approach called EMBEDDED documents but I don't think it's a good approach for a cart

    // Check if cart has no products
    const cart = res.locals.cart;
    let cartStatus;
    if (!cart.product[0]) {
      cartStatus = 'Your cart is empty';
    } else {
      cartStatus = await cart.execPopulate(
        'product',
        'name pricePerUnit stock description addedBy photo'
      );
    }
    // ATTENTION! For some reason populate() doesn't work inside an if statement - you need to use execPopulate
    res.status(200).json({
      success: true,
      data: cartStatus,
    });
  }
);
// @desc    Add product to cart
// @route   GET /api/v1/cart/add/:id
// @access  Private
export const addItemToCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const cart = res.locals.cart;

    // Check if product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(
        new ErrorResponse(
          `Product with id of ${req.params.id} does not exist`,
          404
        )
      );
    }

    cart.product.addToSet(req.params.id);
    cart.save();

    // Check if product is duplicate
    if (cart.isModified('product') === false)
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
