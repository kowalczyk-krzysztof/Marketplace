import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';
import User from '../models/User';
import Cart from '../models/Cart';

// @desc    Get all users
// @route   GET /api/v1/admin/users/
// @access  Admin
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as User;
    if (user.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${user.role} is unauthorized to access this route`,
        403
      );

    const findUser = await User.find();

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
    const user = req.user as User;
    if (user.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${user.role} is unauthorized to access this route`,
        403
      );
    const findUser = await User.userExists(req.params.id);

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
    const userDetails = req.user as User;
    if (userDetails.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${userDetails.role} is unauthorized to access this route`,
        403
      );
    const user = await User.userExists(req.params.id);

    // Check if admin is trying to edit its own profile
    if (user.id === userDetails.id)
      throw new ErrorResponse(
        `If you want to edit yourself go to your profile`,
        401
      );

    if (user.role === 'ADMIN')
      // Check if user is another admin
      throw new ErrorResponse(`You can not edit other admins`, 401);

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
    const userDetails = req.user as User;

    if (userDetails.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${userDetails.role} is unauthorized to access this route`,
        403
      );
    const user = await User.userExists(req.params.id);

    // Check if user is trying to delete itself
    if (user.id === userDetails.id) {
      throw new ErrorResponse(`You can't delete yourself`, 401);
    }

    // Check if user is another admin
    if (user.role === 'ADMIN') {
      throw new ErrorResponse(`You can not delete other admins`, 401);
    }

    await User.findByIdAndDelete(req.params.id);

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
    const userDetails = req.user as User;
    if (userDetails.role !== 'ADMIN')
      throw new ErrorResponse(
        `User with role of ${userDetails.role} is unauthorized to access this route`,
        403
      );
    const cart = await Cart.cartExists(req.params.id);
    let cartStatus;
    let productCount;

    if (cart.product.length === 0) cartStatus = 'Cart is empty';
    else {
      (cartStatus = await cart.execPopulate(
        'product',
        'name pricePerUnit stock description addedBy photo'
      )),
        (productCount = cart.product.length);
    }

    res.status(200).json({
      success: true,
      count: productCount,
      data: cartStatus,
    });
  } catch (err) {
    next(err);
  }
};
