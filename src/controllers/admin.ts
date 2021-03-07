import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';
import User from '../models/User';
import Cart from '../models/Cart';
import Category from '../models/Category';

// @desc    Get all users
// @route   GET /api/v1/admin/users/
// @access  Admin
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Checks if req.user has required role
    const user: User = req.user as User;
    if (user.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${user.role} is unauthorized to access this route`,
        403
      );
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

// @desc    Get single user
// @route   GET /api/v1/admin/users/:id
// @access  Admin
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Checks if req.user has required role
    const user: User = req.user as User;
    if (user.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${user.role} is unauthorized to access this route`,
        403
      );
    // Finds a single user
    const findUser: User = await User.userExists(req.params.id);

    res.status(200).json({ sucess: true, data: findUser });
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
    if (loggedInUser.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${loggedInUser.role} is unauthorized to access this route`,
        403
      );
    // Checks if user you want to update exists
    const user: User = await User.userExists(req.params.id);

    // Check if admin is trying to edit its own profile
    if (user.id === loggedInUser.id)
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
    if (loggedInUser.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${loggedInUser.role} is unauthorized to access this route`,
        403
      );
    // Checks if user you want to delete exists
    const user: User = await User.userExists(req.params.id);

    // Check if user is trying to delete itself
    if (user.id === loggedInUser.id) {
      throw new ErrorResponse(`You can't delete yourself`, 401);
    }

    // Checks if user you want to delete is another admin
    if (user.role === 'ADMIN') {
      throw new ErrorResponse(`You can not delete other admins`, 401);
    }
    // Deletes user you want to delete
    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: `Deleted user with id of: ${user.id}`,
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
) => {
  try {
    // Checks if req.user has required role
    const loggedInUser: User = req.user as User;
    if (loggedInUser.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${loggedInUser.role} is unauthorized to access this route`,
        403
      );
    // Checks if cart exists, if not it will create a new one
    const cart: Cart = await Cart.cartExists(req.params.id);
    let cartStatus: Cart | string;
    let productCount: number = cart.products.length;

    if (productCount === 0) cartStatus = 'Cart is empty';
    else
      cartStatus = await cart
        .populate(
          'products',
          'name pricePerUnit stock description addedBy photo'
        )
        .execPopulate();

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
) => {
  try {
    // Checks if req.user has required role
    const loggedInUser: User = req.user as User;
    if (loggedInUser.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${loggedInUser.role} is unauthorized to access this route`,
        403
      );
    // Adds a new category
    const category: Category = await Category.create({ name: req.body.name });
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
) => {
  try {
    // Checks if req.user has required role
    const loggedInUser: User = req.user as User;
    if (loggedInUser.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${loggedInUser.role} is unauthorized to access this route`,
        403
      );
    const category: Category = await Category.categoryExists(req.params.id);
    await category.deleteOne();

    res.status(200).json({
      success: true,
      data: `Deleted category with with id of: ${category._id}`,
    });
  } catch (err) {
    next(err);
  }
};
