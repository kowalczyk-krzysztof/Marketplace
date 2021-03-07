import mongoose from 'mongoose';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';
import { ErrorResponse } from '../utils/ErrorResponse';
import Product from '../models/Product';
import User from '../models/User';
import Category from '../models/Category';

// @desc    Get single product
// @route   GET /api/v1/products/manage/:id
// @access  Public
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product: Product = await Product.productExists(req.params.id);

    res.status(200).json({ sucess: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getManyProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products: Product[] = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product
// @route   POST /api/v1/products/manage/
// @access  Private
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: User = req.user as User;

    const allowedRoles: string[] = ['MERCHANT', 'ADMIN'];
    if (!allowedRoles.includes(user.role))
      throw new ErrorResponse(
        `User with role of ${user.role} is unauthorized to access this route`,
        403
      );
    // Check is user already has a product with provided name
    const nameUniqueForUser: Product | null = await Product.findOne({
      addedById: user.id,
      name: req.body.name,
    });
    if (nameUniqueForUser) {
      throw new ErrorResponse(
        `${user.id} already has a product with name of ${req.body.name}`,
        400
      );
    }

    // Check if categories exist
    const categoriesToCheck: string[] = req.body.categories;
    const categories: Category[] = await Category.find({
      name: { $in: categoriesToCheck },
    });

    const validCategories: string[] = [];
    const notValidCategories: string[] = [];
    const validCategoriesById = [];

    for (const category of categories) {
      validCategories.push(category.name);
      validCategoriesById.push(category._id);
    }

    // Checking if user is trying to add to a non existent category
    for (const category of categoriesToCheck) {
      if (!validCategories.includes(category))
        notValidCategories.push(category);
    }

    if (notValidCategories.length > 0)
      throw new ErrorResponse(
        `Categories ${notValidCategories} do not exist`,
        404
      );

    // Limiting the number of products a merchant can add
    const maxProducts: number = 5;
    const totalAddedProducts: Product[] = await Product.find({
      addedById: user.id,
    });

    if (totalAddedProducts.length >= maxProducts && user.role !== 'ADMIN')
      throw new ErrorResponse(
        `Maximum number of products a merchant can add is ${maxProducts}`,
        400
      );

    const product = await Product.create({
      name: req.body.name,
      quantity: req.body.quantity,
      description: req.body.description,
      pricePerUnit: req.body.pricePerUnit,
      addedById: user.id,
      categories: validCategoriesById,
    });

    // Adding product to addedProducts in user who created the product
    user.addedProducts.push(product.id);
    user.save();

    // Adding product to categories
    for (const category of categories) {
      category.products.addToSet(product.id);
      category.save();
    }

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/manage/:id
// @access  Private
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: User = req.user as User;
    const allowedRoles: string[] = ['MERCHANT', 'ADMIN'];
    if (!allowedRoles.includes(user.role))
      throw new ErrorResponse(
        `User with role of ${user.role} is unauthorized to access this route`,
        403
      );

    const product: Product = await Product.productExists(req.params.id);

    // Check if user is the products owner or admin
    if (product.addedById !== user.id && user.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with id ${user.id} is not authorised to update this product`,
        401
      );

    const updatedProduct: Product | null = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({ sucess: true, data: updatedProduct });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/manage/:id
// @access  Private
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: User = req.user as User;
    const allowedRoles: string[] = ['MERCHANT', 'ADMIN'];
    if (!allowedRoles.includes(user.role))
      throw new ErrorResponse(
        `User with role of ${user.role} is unauthorized to access this route`,
        403
      );

    const product: Product = await Product.productExists(req.params.id);
    // Check if user is the products owner or admin
    if (product.addedById !== user.id && user.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with id of ${user.id} is not authorised to delete this product`,
        401
      );

    // For some reason, to use 'deleteOne' hook you have to use deleteOne, findOneAndDelete doesn't work, neither does findByIdAndDelete
    await product.deleteOne();

    res.status(200).json({
      sucess: true,
      data: `Deleted product with id of ${product.id}`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get merchant by product id
// @route   GET /api/v1/products/:id/merchant
// @access  Public

export const getMerchantFromProductId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product: Product = await Product.productExists(req.params.id);
    const merchant: User = await User.userExists(product.addedById);

    res.status(200).json({
      success: true,
      data: merchant,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get product by merchant id
// @route   GET /api/v1/products/merchant/:id
// @access  Public

export const getProductsByMerchant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products: Product[] = await Product.find({
      addedById: req.params.id,
    });

    // Check if merchant has any products
    if (products.length === 0)
      throw new ErrorResponse(
        `No products from user with id of ${req.params.id}`,
        404
      );

    res
      .status(200)
      .json({ success: true, count: products.length, products: products });
  } catch (err) {
    next(err);
  }
};

// @desc      Upload photo for product
// @route     PUT /api/v1/products/manage/:id/photo
// @access    Private
export const productFileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = req.user as User;
    const allowedRoles: string[] = ['MERCHANT', 'ADMIN'];
    if (!allowedRoles.includes(user.role))
      throw new ErrorResponse(
        `User with role of ${user.role} is unauthorized to access this route`,
        403
      );
    const product: Product = await Product.productExists(req.params.id);

    // Check if user is product owner
    if (product.addedById !== user.id && user.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with id of ${user.id} is not authorized to update this product`,
        401
      );
    // Check if there is a file to upload
    if (!req.files) throw new ErrorResponse(`Please upload a file`, 400);

    const file: UploadedFile = req.files.file as UploadedFile;

    // Check if uploaded image is a photo

    if (!file.mimetype.startsWith('image'))
      throw new ErrorResponse(`Please upload an image file`, 400);

    // Check file size
    const maxFileSizeInBytes: number = (process.env
      .MAX_FILE_UPLOAD_BYTES as unknown) as number;
    const maxFileSizeInMB: number = maxFileSizeInBytes / 1048576; // 1 mb = 1048576 bytes

    if (file.size > maxFileSizeInBytes)
      throw new ErrorResponse(
        `Please upload an image less than ${maxFileSizeInMB}MB`,
        400
      );
    // Dynamic directory
    const dir: string = `${product.id}`;
    // Generating random hash for product name
    const hash: string = crypto.randomBytes(5).toString('hex');

    // Create custom filename
    file.name = `product_${product.id}_${hash}${path.parse(file.name).ext}`;

    // Checking if file already exists $addToSet already handles duplicates inside db but I don't want the file to get overriden. There's a very low chance of this happening with added hash, but it still can happen
    if (product.photos.includes(file.name))
      throw new ErrorResponse('File already exists', 400);

    // Limiting how many images a product can have
    const maxImages: number = 5;
    if (product.photos.length >= maxImages)
      throw new ErrorResponse(`You can only upload ${maxImages} images`, 400);

    // Moving file to folder
    file.mv(
      `${process.env.FILE_UPLOAD_PATH}/products/${dir}/${file.name}`,
      async (err: Error) => {
        if (err) {
          console.error(err);
          throw new ErrorResponse(`Problem with file upload`, 500);
        }

        await Product.findByIdAndUpdate(req.params.id, {
          $addToSet: { photos: file.name },
        });

        res.status(200).json({
          success: true,
          data: file.name,
        });
      }
    );
  } catch (err) {
    next(err);
  }
};
