import { RequestHandler, Response } from 'express';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import { ErrorResponse } from '../utils/ErrorResponse';
import { sendEmail } from '../utils/sendEmail';
import User from '../models/User';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register: RequestHandler = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
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

// @desc    Logged in user edit name and email
// @route   PUT /api/v1/auth/changedetails
// @access  Private
export const updateNameAndEmail: RequestHandler = asyncHandler(
  async (req, res, next) => {
    // Limits fields user can update
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ sucess: true, data: user });
  }
);
// @desc    Logged in user edit password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
export const updatePassword: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return next(new ErrorResponse(`User not found`, 404));
    }

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
export const forgotPassword: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    // Check is user exists
    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }
    // Get reset token
    let resetToken = user.getResetPasswordToken();
    console.log(resetToken);

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/resetpassword/${resetToken}`;
    // Create message to pass, in actual frontend you want to put an actual link inside

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    // Sending email
    try {
      // Passing options
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log(err);
      // If something goes wrong then delete the token and expire from dataabase
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  }
);
// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public

export const resetPassword: RequestHandler = asyncHandler(
  async (req, res, next) => {
    // Get hashed token from unhashed req.params.resettoken
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // is greater than Date.now()
    });

    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  }
);

// Get token from model, create cookie and send response
const sendTokenResponse = (user: User, statusCode: number, res: Response) => {
  const token: string = user.getSignedJwtToken(); // jsonwebtoken
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
