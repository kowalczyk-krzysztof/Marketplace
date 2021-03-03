import path from 'path';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';
import { ErrorResponse } from '../utils/ErrorResponse';
import { sendEmail } from '../utils/sendEmail';
import { sendTokenResponse } from '../utils/sendTokenResponse';
import User from '../models/User';
import Product from '../models/Product';

// @desc    Register user
// @route   POST /api/v1/user/register
// @access  Public
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await User.create(req.body);
    const siteUrl = `${req.protocol}://${req.get('host')}`;
    console.log(siteUrl);

    // Check if user is trying to register as admin
    if (req.body.role === 'ADMIN') {
      return next(new ErrorResponse('You can not register as an ADMIN', 401));
    }

    const message = `You are receiving this email because you (or someone else) has created an account in ${siteUrl}.`;
    await sendEmail({
      email: req.body.email,
      subject: 'Welcome to Marketplace',
      message,
    });
    // I dont want the user to get assigned a JWT token when registering
    res
      .status(200)
      .json({ success: true, message: 'Account created. Check your email' });
  }

  // TODO - add email authentication
);

// @desc    Login user
// @route   POST /api/v1/user/login
// @access  Public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    // Check is email and password are provided in req.body
    if (!email || !password) {
      return next(
        new ErrorResponse('Please provide an email and password', 400)
      );
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
  }
);
// @desc    Get current logged in user
// @route   GET /api/v1/user/profile
// @access  Private
export const getMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(res.locals.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @desc    Logged in user edit name, email and role
// @route   PUT /api/v1/user/profile/changedetails
// @access  Private
export const updateNameAndEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Limits fields user can update
    const user = res.locals.user;

    // Without those || expressions fields could be empty and both email and name are required by schema
    const fieldsToUpdate = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      role: req.body.role || user.role,
    };

    // Check if user is trying to register as admin
    if (req.body.role === 'ADMIN') {
      return next(new ErrorResponse('You can not set role to ADMIN', 401));
    }

    const updatedUser = await User.findByIdAndUpdate(
      res.locals.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({ sucess: true, data: updatedUser });
  }
);
// @desc    Logged in user edit password
// @route   PUT /api/v1/user/profile/updatepassword
// @access  Private
export const updatePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(res.locals.user.id).select('+password');

    if (!user) {
      return next(new ErrorResponse(`User not found`, 404));
    }

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 201, res);
  }
);

// @desc    Forgot password
// @route   PUT /api/v1/user/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findOne({ email: req.body.email });

    // Check is user exists
    if (!user) {
      return next(
        new ErrorResponse(`There is no user with email ${req.body.email}`, 404)
      );
    }
    // Get reset token
    let resetToken = user.getResetPasswordToken();
    console.log(resetToken);

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/user/resetpassword/${resetToken}`;
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
// @route   PUT /api/v1/user/resetpassword/:resettoken
// @access  Public

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Get hashed token from unhashed req.params.resettoken
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // is greater than Date.now()
    });
    console.log(user);

    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 201, res);
  }
);

// @desc    Log user out / clear cookie
// @route   POST /api/v1/user/logout
// @access  Private
export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });
    // TODO Blacklist cookies
    res.status(200).json({
      success: true,
    });
  }

  // TODO Add cookie blacklisting
);
// @desc      Upload photo for logged in user
// @route     PUT /api/v1/user/profile/photo
// @access    Private
export const userPhotoUpload = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(res.locals.user.id);

    // Check if user exists
    if (!user) {
      return next(
        new ErrorResponse(
          `User not found with id of ${res.locals.user.id}`,
          404
        )
      );
    }

    // Check if there is a file to upload
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file as UploadedFile;

    // Check if uploaded image is a photo

    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check file size
    const maxFileSizeInBytes = (process.env
      .MAX_FILE_UPLOAD_BYTES as unknown) as number;
    const maxFileSizeInMB = maxFileSizeInBytes / 1048576; // 1 mb = 1048576 bytes

    if (file.size > maxFileSizeInBytes) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${maxFileSizeInMB}MB`,
          400
        )
      );
    }

    // Create custom filename
    file.name = `user_${user.id}${path.parse(file.name).ext}`;
    // Moving file to folder
    file.mv(
      `${process.env.FILE_UPLOAD_PATH}/users/${file.name}`,
      async (err: Error) => {
        if (err) {
          console.error(err);
          return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await User.findByIdAndUpdate(res.locals.user.id, { photo: file.name });

        res.status(200).json({
          success: true,
          data: file.name,
        });
      }
    );
  }
);

// @desc    Get products created by logged in user
// @route   GET /api/v1/profile/products
// @access  Private

export const myCreatedProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = res.locals.user.id;
    const products = await Product.find({ addedById: user });

    // Check if logged in user has any created products
    if (products.length === 0) {
      return next(new ErrorResponse(`You have not added any products`, 404));
    }

    res.status(200).json({ success: true, data: products });
  }
);
