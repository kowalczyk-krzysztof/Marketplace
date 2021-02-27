import { RequestHandler, Response } from 'express';
import User from '../models/User';
import asyncHandler from 'express-async-handler';
import { ErrorResponse } from '../utils/ErrorResponse';

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

  // // Create token
  // const token = user.getSignedJwtToken();
  // res.status(200).json({ sucess: true, token });
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
  // // Create token
  // const token = user.getSignedJwtToken();
  // res.status(200).json({ sucess: true, token });
  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user: User, statusCode: number, res: Response) => {
  const token: string = user.getSignedJwtToken();
  const expireTime = (process.env.JWT_COOKIE_EXPIRE as unknown) as number;

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
