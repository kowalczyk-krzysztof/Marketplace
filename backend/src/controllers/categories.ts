import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';

// @desc    Get all categories
// @route   GET /api/v1/categories/list
// @access  Public
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1 = show field, 0 = hide
    const products: Category[] = await Category.find(
      {},
      {
        name: 1,
        // _id: 0,
      }
    );

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all products in a category
// @route   GET /api/v1/category/find/:id
// @access  Public
export const getProductsFromCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category: Category = await Category.categoryExists(req.params.id);

    const categoryProducts: Category = await category
      .populate('products', 'name pricePerUnit stock description addedBy photo')
      .execPopulate();

    res.status(200).json({
      success: true,
      count: categoryProducts.products.length,
      data: categoryProducts,
    });
  } catch (err) {
    next(err);
  }
};
