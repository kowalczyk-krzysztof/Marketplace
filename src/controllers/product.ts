import { RequestHandler } from 'express';
import ProductSchema from '../models/Product';

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await ProductSchema.find();

    res.status(200).json({
      success: true,
      numberOfProducts: products.length,
      data: products,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await ProductSchema.findById(req.params.id);

    // If ID format is valid but it doesn't exist
    if (!product) {
      return res.status(400).json({ success: false, msg: 'ID does not exist' });
    }

    res.status(200).json({ sucess: true, data: product });
  } catch (err) {
    // If ID is in invalid format
    // res.status(400).json({ success: false, msg: 'Invalid ID' });
    next(err);
  }
};
// @desc    Create product
// @route   PUT /api/v1/products/
// @access  Private
export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await ProductSchema.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Duplicate entry' });
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await ProductSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) {
      return res.status(400).json({ success: false, msg: 'ID does not exist' });
    }

    res.status(200).json({ sucess: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Something went wrong' });
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await ProductSchema.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(400).json({ success: false, msg: 'ID does not exist' });
    }

    res.status(200).json({ sucess: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Something went wrong' });
  }
};
