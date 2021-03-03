import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { ErrorResponse } from '../utils/ErrorResponse';
import User from '../models/User';
import Cart from '../models/Cart';

// @desc    Edit user
// @route   PUT /api/v1/users/:id
// @access  Admin
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) {
      return next(new ErrorResponse(`User doesn't exist`, 401));
    }

    // Check if user is another admin
    if (user.role === 'ADMIN') {
      return next(new ErrorResponse(`You can not edit other admins`, 401));
    }
    await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ sucess: true, data: user });
  }
);

// @desc    Delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Admin
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // This is needed because otherwise you won't be able to get user.role
    const user = await User.findById(req.params.id);

    // Check if user is trying to delete himself, the check has to be done before you use findByIdAndDelete
    if (req.params.id === res.locals.user.id) {
      return next(new ErrorResponse(`You can't delete yourself`, 401));
    }

    // Check if user exists
    if (!user) {
      return next(new ErrorResponse(`User doesn't exist`, 401));
    }

    // Check if user is another admin
    if (user.role === 'ADMIN') {
      return next(new ErrorResponse(`You can not delete other admins`, 401));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: `Deleted user with id of: ${req.params.id}`,
    });
  }
);
// @desc    Get all users
// @route   GET /api/v1/auth/users/
// @access  Admin
export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.find();

    res.status(200).json({
      success: true,
      numberOfUsers: user.length,
      data: user,
    });
  }
);

// @desc    Get single user
// @route   GET /api/v1/auth/users/:id
// @access  Admin
export const getUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user;

    res.status(200).json({ sucess: true, data: user });
  }
);
// @desc    Get cart of user
// @route   GET /api/v1/auth/users/:id/cart
// @access  Admin
export const getUserCart = asyncHandler(async (req: Request, res: Response) => {
  const checkCart = await Cart.findOne({ owner: req.params.id });
  let cartStatus;
  // Check if cart exists
  if (!checkCart) {
    await Cart.create({ owner: req.params.id });
    cartStatus = 'Cart is empty';
  }
  const cart = await Cart.findOne({ owner: req.params.id });
  // Check is cart has products
  if (!cart?.product[0]) {
    cartStatus = 'Cart is empty';
  } else {
    cartStatus = await cart
      .populate('product', 'name pricePerUnit stock description addedBy photo')
      .execPopulate();
  }
  res.status(200).json({
    success: true,
    data: cartStatus,
  });
});
