import { RequestHandler } from 'express';
import ProductSchema from '../models/Product';

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts: RequestHandler = (req, res, next): void => {
  res.status(200).json({ success: true, msg: 'Show all products' });
};
// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct: RequestHandler = (req, res, next): void => {
  res.status(200).json({ success: true, msg: `Get product ${req.params.id}` });
};
// @desc    Create product
// @route   PUT /api/v1/products/
// @access  Private
export const createProduct: RequestHandler = (req, res, next): void => {
  console.log(req.body);
  res.status(200).json({ success: true, msg: `Create new product` });
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct: RequestHandler = (req, res, next): void => {
  res
    .status(200)
    .json({ success: true, msg: `Update product ${req.params.id}` });
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct: RequestHandler = (req, res, next): void => {
  res
    .status(200)
    .json({ success: true, msg: `Delete product ${req.params.id}` });
};
