import { RequestHandler, Response } from 'express';
import User from '../models/User';
import asyncHandler from 'express-async-handler';
import { ErrorResponse } from '../utils/ErrorResponse';

// Get token from model, create cookie and send response
const sendTokenResponse = (user: User, statusCode: number, res: Response) => {
  const token: string = user.getSignedJwtToken();
  const expireTime = (process.env.JWT_COOKIE_EXPIRE as unknown) as number;
  // Cookie options
  const options = {
    expires: new Date(Date.now() + expireTime * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res.status(statusCode).cookie('token', token, options).json({
    succcess: true,
    token,
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register: RequestHandler = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login: RequestHandler = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});
// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
export const getMe: RequestHandler = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Admin
export const deleteUser: RequestHandler = asyncHandler(
  async (req, res, next) => {
    // if (mongoose.isValidObjectId(req.params.id) === false) {
    //   return next(new ErrorResponse(`Invalid id format`, 401));
    // }
    // Above check is not needed if you are using any of the findById methods - they will return a CastError which is handled by error handler

    // This is needed because otherwise I won't be able to get user.role
    const user = await User.findById(req.params.id);

    // Check if user is trying to delete himself, the check has to be done before you use findByIdAndDelete
    if (req.params.id === req.user.id) {
      return next(new ErrorResponse(`You can't delete yourself`, 401));
    }

    // Check if user exists
    if (!user) {
      return next(new ErrorResponse(`User doesn't exist`, 401));
    }

    // Check if user is another admin
    if (user.role === 'admin') {
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
export const getUsers: RequestHandler = asyncHandler(async (req, res) => {
  const user = await User.find();

  res.status(200).json({
    success: true,
    numberOfUsers: user.length,
    data: user,
  });
});

// @desc    Get single user
// @route   GET /api/v1/auth/users/:id
// @access  Admin
export const getUser: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  // If id format is valid but user doesn't exist
  if (!user) {
    return next(
      new ErrorResponse(`user not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ sucess: true, data: user });
});
// @desc    Edit user (self)
// @route   PUT /api/v1/auth/me
// @access  Private
export const updateMe: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ sucess: true, data: user });
});

// @desc    Edit user
// @route   PUT /api/v1/users/:id
// @access  Admin
export const updateUser: RequestHandler = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ sucess: true, data: user });
});
