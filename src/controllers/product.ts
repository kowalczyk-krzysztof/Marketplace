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
export const createProduct: RequestHandler = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

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
