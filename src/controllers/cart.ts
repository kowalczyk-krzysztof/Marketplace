import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart';

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
    const cart = await Cart.findOne({ owner: req.user.id }).populate('product');

    res.status(200).json({
      success: true,
      data: cart,
    });
  }
});
// @desc    Add product to cart
// @route   POST /api/v1/cart/add/
// @access  Private
export const addItemToCart: RequestHandler = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ owner: req.user.id });
  const addedProducts: string[] = req.body.products;
  const duplicateProduct: string[] = [];
  const uniqueProduct: string[] = [];

  // Adding only unique products and logging each product
  addedProducts.forEach((el: string) => {
    if (cart?.product.includes(el)) return duplicateProduct.push(el);
    // Return in if statements inside foreach loop skips to next iteration
    cart?.product.push(el);
    uniqueProduct.push(el);
  });

  let message: string;
  if (uniqueProduct.length <= 0)
    message = `You already have ${duplicateProduct} in your cart`;
  else if (duplicateProduct.length <= 0)
    message = `Added products: ${uniqueProduct}.`;
  else
    message = `Added products: ${uniqueProduct}. Duplicates (not added): ${duplicateProduct}`;

  // If pushing to array of referenced documents, you need to save
  cart?.save();
  res.status(201).json({
    success: true,
    data: message,
  });
});
