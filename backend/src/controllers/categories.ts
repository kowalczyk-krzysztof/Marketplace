import { Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import Category from '../models/Category';

/**
 * Originally I wanted users to be able to add multiple categories to a product. I made a check in case user wanted to add two or more categories from the same root e.g add "computers" and "phones" (root category "technology"). That check would find if both products have the same root and throw error if so. Then I realised users could add products to two completely different categories e.g "computers" and "animals" and that would make no sense. So in the end I opted for just one category per product.
 */

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
        slug: 1,
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
    const category: Category = await Category.categoryIdExists(categoryId);

    res.status(200).json({
      success: true,
      productCount: category.products.length,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get path to root category
// @route   GET /api/v1/categories/category/root/:id
// @access  Pyblic
export const getPathToRoot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryId: ObjectID = (req.params.id as unknown) as ObjectID;
    const category: Category = await Category.categoryIdExists(categoryId);

    const sortedCategories = await Category.findPath(category.name);

    res.status(200).json({ success: true, data: sortedCategories });
  } catch (err) {
    next(err);
  }
};

/**
 * This is a tuple 
 * categoryValidation(category: ObjectID): Promise<[ObjectID[], Category[]]>;
 * To deconstruct the array and assign the correct types you need to do it like this
 *    const categoryIds: ObjectID[] = validCategories[0];
      const categoryObject: Category[] = validCategories[1];
 * 
 */
