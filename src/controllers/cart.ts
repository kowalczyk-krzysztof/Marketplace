import { Request, Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import User from '../models/User';
import { ErrorResponse } from '../utils/ErrorResponse';
import mongoose, { ObjectId } from 'mongoose';

// @desc    Get cart of logged in user
// @route   GET /api/v1/cart/mycart
// @access  Private
export const getMyCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // This is called REFERENCING documents - it queries for every single document, there's an another approach called EMBEDDED documents but I don't think it's a good approach for a cart

    // Check if cart has no products
    const userDetails: User = req.user as User;

    const cart: Cart = await Cart.cartExists(userDetails.id);
    let cartStatus: Cart | string;
    let productCount;
    if (cart.products.length === 0) cartStatus = 'Your cart is empty';
    else {
      cartStatus = await cart
        .populate(
          'products',
          'name pricePerUnit stock description addedBy photo'
        )
        .execPopulate();

      productCount = cart.products.length;
    }

    res.status(200).json({
      success: true,
      count: productCount,
      data: cartStatus,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add single product to cart
// @route   PUT /api/v1/cart/add/:id
// @access  Private
export const addProductToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userDetails: User = req.user as User;
    const cart: Cart = await Cart.cartExists(userDetails.id);

    // Check if product exists
    await Product.productExists(req.params.id);

    cart.products.addToSet(req.params.id);
    cart.save();

    // Check if product is duplicate
    if (cart.isModified('product') === false)
      res.status(400).json({
        success: false,
        data: `You already have product with id of ${req.params.id} in your cart`,
      });
    else
      res.status(201).json({
        success: true,
        data: `Added product with id of ${req.params.id} to your cart`,
      });
  } catch (err) {
    next(err);
  }
};

// @desc    Add many products to cart
// @route   PUT /api/v1/cart/add/
// @access  Private
export const addManyProductsToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userDetails: User = req.user as User;
    const cart: Cart = await Cart.cartExists(userDetails.id);
    const productsToAdd: mongoose.Schema.Types.ObjectId[] = req.body.products;
    const addedProducts: mongoose.Schema.Types.ObjectId[] = [];

    // Adding products
    for (const product of productsToAdd) {
      if (!mongoose.isValidObjectId(product))
        throw new ErrorResponse('One or more products has an invalid id', 400);

      const productExists: Product | null = await Product.findById(product);
      if (productExists && !cart.products.includes(product)) {
        cart.products.push(product);
        addedProducts.push(product);
      }
    }

    let message: string;
    if (addedProducts.length === 0)
      message = `No products were added. Some might be already in your cart`;
    else
      message = `Added products: ${addedProducts}. If you don't see some products, they might be already in your cart`;

    cart.save();

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (err) {
    next(err);
  }
};
// @desc    Delete single product from cart
// @route   PUT /api/v1/cart/mycart/delete/:id
// @access  Private
export const deleteProductFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userDetails: User = req.user as User;
    const cart = await Cart.cartExists(userDetails.id);

    const product: string = req.params.id;
    if (!cart.products.includes(product))
      throw new ErrorResponse('Something went wrong', 400);

    cart.products.pull(product);
    cart.save();

    res.status(201).json({
      success: true,
      data: `Removed product with id of ${product} from your cart`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete many products from cart
// @route   PUT /api/v1/cart/mycart/delete/
// @access  Private

export const deleteManyProductFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userDetails: User = req.user as User;
    const cart: Cart = await Cart.cartExists(userDetails.id);
    const productsToDelete: mongoose.Schema.Types.ObjectId[] =
      req.body.products;
    const deletedProducts: mongoose.Schema.Types.ObjectId[] = [];

    //  .forEach expects a synchronous function and won't do anything with the return value. It just calls the function and on to the next. for...of will actually await on the result of the execution of the function.

    // User shouldn't have non existent elements in his cart
    for (const product of productsToDelete) {
      if (cart.products.includes(product)) {
        cart.products.pull(product);
        deletedProducts.push(product);
      }
    }

    if (deletedProducts.length === 0)
      throw new ErrorResponse('Something went wrong', 400);

    cart.save();

    res.status(201).json({
      success: true,
      data: `Removed products: ${deletedProducts}`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Empty cart
// @route   PUT /api/v1/cart/mycart/delete/:id
// @access  Private
export const emptyCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userDetails: User = req.user as User;
    const cart: Cart = await Cart.cartExists(userDetails.id);
    if (cart.products.length === 0)
      throw new ErrorResponse(`Your cart is already empty`, 400);

    cart.products.splice(0, cart.products.length);
    cart.save();

    res.status(200).json({
      success: true,
      message: 'Your cart is now empty',
    });
  } catch (err) {
    next(err);
  }
};
