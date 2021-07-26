import { Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import Category from '../models/Category';
import { ErrorResponse } from '../utils/ErrorResponse';

/**
 * Originally I wanted users to be able to add multiple categories to a product. I made a check in case user wanted to add two or more categories from the same root e.g add "computers" and "phones" (root category "technology"). That check would find if both products have the same root and throw error if so. Then I realised users could add products to two completely different categories e.g "computers" and "animals" and that would make no sense. So in the end I opted for just one category per product.
 */

// @desc    Get all root categories
// @route   GET /api/v1/categories/roots
// @access  Public
export const getRootCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // This query will return all root categories and their direct children
    const categories = await Category.aggregate([
      {
        $match: {
          parent: null,
        },
      },
      {
        $lookup: {
          from: 'categories', // collection
          localField: '_id', // field from result of $match
          foreignField: 'parent', // field to search in
          as: 'children', // array where results will be pushed
        },
      },
    ]);

    res.status(200).json(categories);
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
    const categoryId: ObjectID = req.params.id as unknown as ObjectID;
    const category: Category = await Category.categoryExists(categoryId);

    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

// @desc    Get path to root category
// @route   GET /api/v1/categories/category/root?category=
// @access  Public
export const getPathToRoot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ATTENTION! Searching by SLUG
    const categorySlug: string = req.query.category as string;

    if (!categorySlug)
      throw new ErrorResponse('Please enter category name', 400);

    const sortedCategories = await Category.findPathToRoot(categorySlug);

    res.status(200).json(sortedCategories);
  } catch (err) {
    next(err);
  }
};

// @desc    Get direct children
// @route   GET /api/v1/categories/category/children?category=
// @access  Public
export const getDirectChildren = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ATTENTION! Searching by SLUG
    const categorySlug: string = req.query.category as string;
    if (!categorySlug)
      throw new ErrorResponse('Please enter category name', 400);

    const document = await Category.aggregate([
      {
        $match: {
          slug: categorySlug,
        },
      },
      {
        $lookup: {
          from: 'categories', // collection
          localField: '_id', // field from result of $match
          foreignField: 'parent', // field to search in
          as: 'children', // array where results will be pushed
        },
      },
    ]);

    const childrenCategories = document[0].children; // result will be only ONE document becase slugs are unique, so $match will make it so there's only one document, that's why I access index 0

    res.status(200).json(childrenCategories);
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
