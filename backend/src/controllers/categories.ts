import { Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

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
    const categories: Category[] = await Category.find(
      {},
      {
        name: 1,
        // _id: 0,
        description: 1,
        parent: 1,
      }
    );

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get category
// @route   GET /api/v1/category/find/:id
// @access  Public
export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryId: ObjectID = (req.params.id as unknown) as ObjectID;
    const category: Category = await Category.categoryExists(categoryId); // Checking if lowestBranch exists

    res.status(200).json({
      success: true,
      productCount: category.products.length,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};
