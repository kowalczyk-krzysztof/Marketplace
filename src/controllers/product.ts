import { RequestHandler } from 'express';
import Product from '../models/Product';
import { ErrorResponse } from '../utils/ErrorResponse';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

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

    // If id format is valid but product doesn't exist
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ sucess: true, data: product });
  }
);
// @desc    Create product
// @route   POST /api/v1/products/
// @access  Private
export const createProduct: RequestHandler = asyncHandler(
  async (req, res, next) => {
    // Adding addedBy to req.body with value of user.name (available from auth middleware)
    req.body.addedBy = req.user.name;
    // Addding addedById to req.body with value of user._id (available from auth middleware)
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
    // Check if id is in valid format
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return next(new ErrorResponse(`Invalid id format`, 401));
    }
    const product = await Product.findById(req.params.id);

    // Check if product exists
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }
    // Check if req.user is the products owner or admin
    if (product.addedById !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User with id ${req.user.id} is not authorised to update this product`,
          401
        )
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ sucess: true, data: updatedProduct });
  }
);

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct: RequestHandler = asyncHandler(
  async (req, res, next) => {
    // Check if id is in valid format
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return next(new ErrorResponse(`Invalid id format`, 401));
    }
    const product = await Product.findById(req.params.id);

    // Check if product exists
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if req.user is the products owner or admin
    if (product.addedById !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User with id ${req.user.id} is not authorised to delete this product`,
          401
        )
      );
    }
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      sucess: true,
      data: `Deleted product with id of ${req.params.id}`,
    });
  }
);

// @desc    Get product by merchant id
// @route   GET /api/v1/products/merchant/:id
// @access  Public

export const getProductsByMerchant: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const products = await Product.find({ addedById: req.params.id });

    // Check if id is valid format
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return next(new ErrorResponse(`Invalid id format`, 401));
    }
    // Check if merchant has any products
    if (!products[0]) {
      return next(
        new ErrorResponse(
          `No products from user of id of ${req.params.id}`,
          401
        )
      );
    }

    res.status(200).json({ success: true, products: products });
  }
);
