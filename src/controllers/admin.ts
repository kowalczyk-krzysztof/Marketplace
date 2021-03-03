import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';
import User from '../models/User';
import Cart from '../models/Cart';

// @desc    Edit user
// @route   PUT /api/v1/users/:id
// @access  Admin
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) throw new ErrorResponse(`User doesn't exist`, 401);

    if (user.id === res.locals.user.id)
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
    // This is needed because otherwise you won't be able to get user.role
    const user = await User.findById(req.params.id);

    // Check if user is trying to delete himself, the check has to be done before you use findByIdAndDelete
    if (req.params.id === res.locals.user.id) {
      throw new ErrorResponse(`You can't delete yourself`, 401);
    }

    // Check if user exists
    if (!user) {
      throw new ErrorResponse(`User doesn't exist`, 401);
    }

    // Check if user is another admin
    if (user.role === 'ADMIN') {
      throw new ErrorResponse(`You can not delete other admins`, 401);
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: `Deleted user with id of: ${req.params.id}`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users/
// @access  Admin
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.find();

    res.status(200).json({
      success: true,
      numberOfUsers: user.length,
      data: user,
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
    const user = res.locals.user;

    res.status(200).json({ sucess: true, data: user });
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
    const checkCart = await Cart.findOne({ owner: req.params.id });
    let cartStatus;
    // Check if cart exists
    if (!checkCart) {
      await Cart.create({ owner: req.params.id });
      cartStatus = 'Cart is empty';
    }
    const cart = await Cart.findOne({ owner: req.params.id });
    // Check is cart has products
    if (cart?.product.length === 0) {
      cartStatus = 'Cart is empty';
    } else {
      cartStatus = await cart
        ?.populate(
          'product',
          'name pricePerUnit stock description addedBy photo'
        )
        .execPopulate();
    }
    res.status(200).json({
      success: true,
      data: cartStatus,
    });
  } catch (err) {
    next(err);
  }
};
