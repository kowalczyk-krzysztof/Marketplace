import mongoose, { Error } from 'mongoose';
import path from 'path';
import { RequestHandler } from 'express';
import { UploadedFile } from 'express-fileupload';
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
// @route   GET /api/v1/products/manage/:id
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

// @desc    Create new product
// @route   POST /api/v1/products/manage/
// @access  Private
export const createProduct: RequestHandler = asyncHandler(
  async (req, res, next): Promise<void> => {
    // Setting a limit so each user can have only one product with the same name, but other users can have products with that name
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
// @route   PUT /api/v1/products/manage/:id
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
// @route   DELETE /api/v1/products/manage/:id
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

// @desc      Upload photo for product
// @route     PUT /api/v1/products/manage/:id/photo
// @access    Private
export const productFileUpload = asyncHandler(async (req, res, next) => {
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

  // Check if user is product owner
  if (product.addedById !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User with id of ${req.params.id} is not authorized to update this product`,
        401
      )
    );
  }
  // Check if there is a file to upload
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file as UploadedFile;

  // Check if uploaded image is a photo

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  const maxFileSizeInBytes = (process.env
    .MAX_FILE_UPLOAD_BYTES as unknown) as number;
  const maxFileSizeInMB = maxFileSizeInBytes / 1048576; // 1 mb = 1048576 bytes

  if (file.size > maxFileSizeInBytes) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${maxFileSizeInMB}MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `product_${product.id}${path.parse(file.name).ext}`;
  // Moving file to folder
  file.mv(
    `${process.env.FILE_UPLOAD_PATH}/products/${file.name}`,
    async (err: Error) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      await Product.findByIdAndUpdate(req.params.id, { photo: file.name });

      res.status(200).json({
        success: true,
        data: file.name,
      });
    }
  );
});
