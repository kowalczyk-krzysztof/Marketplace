import { Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import User from '../models/User';
import Cart from '../models/Cart';
import Category from '../models/Category';
import Product from '../models/Product';
import { ErrorResponse } from '../utils/ErrorResponse';

// @desc    Get all products
// @route   GET /api/v1/admin/products
// @access  Admin
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Checks if req.user has required role
    const loggedInUser: User = req.user as User;
    loggedInUser.roleCheck('ADMIN');
    // Gets all products
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

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Admin
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Checks if req.user has required role
    const loggedInUser: User = req.user as User;
    loggedInUser.roleCheck('ADMIN');
    // Gets a list of all users
    const findUser: User[] = await User.find();

    res.status(200).json({
      success: true,
      count: findUser.length,
      data: findUser,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Edit user
// @route   PUT /api/v1/users/:id
// @access  Admin
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Checks if req.user has required role
    const loggedInUser: User = req.user as User;
    loggedInUser.roleCheck('ADMIN');
    // Checks if user you want to update exists
    const userId: ObjectID = (req.params.id as unknown) as ObjectID;
    const user: User = await User.userExists(userId);

    // Check if admin is trying to edit its own profile
    if (user._id === loggedInUser._id)
      throw new ErrorResponse(
        `If you want to edit yourself go to your profile`,
        401
      );
    // Checks if user you want to update is another admin
    if (user.role === 'ADMIN')
      throw new ErrorResponse(`You can not edit other admins`, 401);

    // Updates user you want to update
    await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ sucess: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Admin
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Checks if req.user has required role
    const loggedInUser: User = req.user as User;
    loggedInUser.roleCheck('ADMIN');
    // Checks if user you want to delete exists

    const userId: ObjectID = (req.params.id as unknown) as ObjectID;
    const user: User = await User.userExists(userId);

    // Check if user is trying to delete itself
    if (user._id === loggedInUser._id) {
      throw new ErrorResponse(`You can not delete yourself`, 401);
    }

    // Checks if user you want to delete is another admin
    if (user.role === 'ADMIN') {
      throw new ErrorResponse(`You can not delete other admins`, 401);
    }
    // Deletes user you want to delete
    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: `Deleted user with _id: ${user._id}`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get cart of user
// @route   GET /api/v1/admin/users/cart/:id
// @access  Admin
export const getUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Checks if req.user has required role
    const loggedInUser: User = req.user as User;
    loggedInUser.roleCheck('ADMIN');
    // Checks if cart exists, if not it will create a new one
    const cartId: ObjectID = (req.params.id as unknown) as ObjectID;
    const cart: Cart = await Cart.cartExists(cartId);
    let cartStatus: Cart | string;
    let productCount: number = cart.products.length;

    if (productCount === 0) cartStatus = 'Cart is empty';
    else cartStatus = await cart.populate('products').execPopulate();

    res.status(200).json({
      success: true,
      count: productCount,
      data: cartStatus,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Adds a new category
// @route   GET /api/v1/admin/categories/add
// @access  Admin
export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Checks if req.user has required role
    const loggedInUser: User = req.user as User;
    loggedInUser.roleCheck('ADMIN');
    // Check for parent category
    const parentCategory = await Category.findOne({ name: req.body.parent });
    let parent: ObjectID | null;
    if (parentCategory) parent = parentCategory._id;
    else parent = null;
    // Adds a new category
    const category: Category = await Category.create({
      name: req.body.name,
      description: req.body.description,
      parent: parent, // If parent category doesn't exist then this means the new category is a new root category
    });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a category
// @route   DELETE /api/v1/admin/categories/delete/:id
// @access  Admin
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Checks if req.user has required role
    const loggedInUser: User = req.user as User;
    loggedInUser.roleCheck('ADMIN');

    const categoryId: ObjectID = (req.params.id as unknown) as ObjectID;
    const category: Category = await Category.categoryIdExists(categoryId);

    // Recursive search with $graphLookup to find all children and their children in category tree
    const subcategories = await Category.aggregate([
      {
        $match: {
          name: category.name, // starts with the category we want to delete
        },
      },
      {
        $graphLookup: {
          from: 'categories', // the collection we operate in
          startWith: '$_id', // what value we search for starts with, $_id is for ObjectID
          connectFromField: '_id', //  field name whose value $graphLookup uses to recursively match against the connectToField
          connectToField: 'parent', // field name in other documents against which to match the value of the field specified by the connectFromField parameter.
          as: 'categoriesToDelete', // name of the array field added to each output document. Contains the documents traversed in the $graphLookup stage to reach the document.
        },
      },
      {
        $project: {
          categoriesToDelete: '$categoriesToDelete._id', // makes it so categoriesToDelete array will only contain ids
        },
      },
    ]);
    // Delete root category
    await category.deleteOne();

    // Delete subcategories
    const categoriesToDelete = subcategories[0].categoriesToDelete;
    for (const categoryId of categoriesToDelete) {
      await Category.deleteOne({ _id: categoryId });
    }

    res.status(200).json({
      success: true,
      data: `Deleted category with with _id: ${category._id} and its subcategories: ${categoriesToDelete}`,
    });
  } catch (err) {
    next(err);
  }
};
// @desc    Get all categories
// @route   GET /api/v1/admin/categories/list
// @access  Admin
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Checks if req.user has required role
    const loggedInUser: User = req.user as User;
    loggedInUser.roleCheck('ADMIN');
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
