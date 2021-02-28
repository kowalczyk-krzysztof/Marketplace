import { RequestHandler } from 'express';
import Product from '../models/Product';
import { ErrorResponse } from '../utils/ErrorResponse';
import asyncHandler from 'express-async-handler';

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts: RequestHandler = asyncHandler(async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    numberOfProducts: products.length,
    data: products,
  });
});
// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    // If ID format is valid but product doesn't exist
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ sucess: true, data: product });
  }
);
// @desc    Create product
// @route   PUT /api/v1/products/
// @access  Private
export const createProduct: RequestHandler = asyncHandler(
  async (req, res, next) => {
    // Adding addedBy to req.body as user.name (from our auth middleware)
    req.body.addedBy = req.user.name;
    // Addding addedById to req.body as user._id (from our auth middleware)
    req.body.addedById = req.user._id;

    // Limiting the number of products a merchant can add
    const maxProducts: number = 5;
    const totalAddedProducts = await Product.find({ addedBy: req.user.name });

    if (totalAddedProducts.length >= maxProducts && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `Maximum number of products a merchant can add is ${maxProducts}`,
          400
        )
      );
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  }
);

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ sucess: true, data: product });
  }
);

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ sucess: true, data: {} });
});

// @desc    Get product by merchant
// @route   GET /api/v1/products/merchant/:id
// @access  Public

export const getProductsByMerchant = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ addedById: req.params.id });

  // Check if the id is valid format
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ErrorResponse(`Invalid ID format`, 401));
  }
  // Check if merchant has any products
  if (!products[0]) {
    return next(new ErrorResponse(`No products by ${req.params.id}`, 401));
  }

  res.status(200).json({ success: true, products: products });
});
