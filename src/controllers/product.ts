import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ErrorResponse } from '../utils/ErrorResponse';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product';

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts: RequestHandler = asyncHandler(
  async (req, res): Promise<void> => {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      numberOfProducts: products.length,
      data: products,
    });
  }
);
// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct: RequestHandler = asyncHandler(
  async (req, res, next): Promise<void> => {
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
export const createProduct: RequestHandler = asyncHandler(
  async (req, res, next): Promise<void> => {
    // Making it so each user can have only one product with the same name, but other users can have products with that name
    const nameUniqueForUser = await Product.findOne({
      addedById: req.user.id,
      name: req.body.name,
    });

    if (nameUniqueForUser) {
      return next(
        new ErrorResponse(
          `${req.user.id} already has a product with name of ${req.body.name}`,
          400
        )
      );
    }

    // Limiting the number of products a merchant can add
    const maxProducts: number = 5;
    const totalAddedProducts = await Product.find({ addedBy: req.user.name });

    if (totalAddedProducts.length >= maxProducts && req.user.role !== 'ADMIN') {
      return next(
        new ErrorResponse(
          `Maximum number of products a merchant can add is ${maxProducts}`,
          400
        )
      );
    }

    const product = await Product.create({
      name: req.body.name,
      quantity: req.body.quantity,
      description: req.body.description,
      pricePerUnit: req.body.pricePerUnit,
      addedById: req.user.id,
    });
    res.status(201).json({ success: true, data: product });
  }
);

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct: RequestHandler = asyncHandler(
  async (req, res, next): Promise<void> => {
    // Check if id is in valid format
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return next(new ErrorResponse(`Invalid id format`, 400));
    }
    const product = await Product.findById(req.params.id);

    // Check if product exists
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }
    // Check if req.user is the products owner or admin
    if (product.addedById !== req.user.id && req.user.role !== 'ADMIN') {
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

    res.status(201).json({ sucess: true, data: updatedProduct });
  }
);

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct: RequestHandler = asyncHandler(
  async (req, res, next): Promise<void> => {
    // Check if id is in valid format
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return next(new ErrorResponse(`Invalid id format`, 400));
    }
    const product = await Product.findById(req.params.id);

    // Check if product exists
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if req.user is the products owner or admin
    if (product.addedById !== req.user.id && req.user.role !== 'ADMIN') {
      return next(
        new ErrorResponse(
          `User with id of ${req.user.id} is not authorised to delete this product`,
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
  async (req, res, next): Promise<void> => {
    const products = await Product.find({ addedById: req.params.id });

    // Check if id is valid format
    if (mongoose.isValidObjectId(req.params.id) === false) {
      return next(new ErrorResponse(`Invalid id format`, 400));
    }
    // Check if merchant has any products
    if (products.length === 0) {
      return next(
        new ErrorResponse(
          `No products from user with id of ${req.params.id}`,
          400
        )
      );
    }

    res.status(200).json({ success: true, products: products });
  }
);
