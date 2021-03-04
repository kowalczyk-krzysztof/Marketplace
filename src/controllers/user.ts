import path from 'path';
import crypto from 'crypto';
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
// TODO - add email authentication
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user is trying to register as admin
    if (req.body.role === 'ADMIN')
      throw new ErrorResponse('You can not register as an ADMIN', 401);

    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'USER',
    });
    const siteUrl = `${req.protocol}://${req.get('host')}`;

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
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/v1/user/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check is email and password are provided in req.body
    if (!email || !password)
      throw new ErrorResponse('Please provide an email and password', 400);

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) throw new ErrorResponse('Invalid credentials', 401);

    // Check if password matches

    const isMatch = await user.matchPassword(password);

    if (!isMatch) throw new ErrorResponse('Invalid credentials', 401);

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/user/profile
// @access  Private
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.userExists(res.locals.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logged in user edit name, email and role
// @route   PUT /api/v1/user/profile/changedetails
// @access  Private
export const updateNameAndEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.userExists(res.locals.user.id);

    // Without those || expressions fields could be empty and both email and name are required by schema

    const fieldsToUpdate = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      role: req.body.role || user.role,
    };

    // Check if user is trying to register as admin
    if (req.body.role === 'ADMIN')
      new ErrorResponse('You can not set role to ADMIN', 401);

    const updatedUser = await User.findByIdAndUpdate(
      res.locals.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({ sucess: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

// @desc    Logged in user edit password
// @route   PUT /api/v1/user/profile/updatepassword
// @access  Private
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(res.locals.user.id).select('+password');

    if (!user) throw new ErrorResponse(`User not found`, 404);

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword)))
      throw new ErrorResponse('Password is incorrect', 401);

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password
// @route   PUT /api/v1/user/forgotpassword
// @access  Public
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Check is user exists
    if (!user)
      throw new ErrorResponse(
        `There is no user with email ${req.body.email}`,
        404
      );
    // Get reset token
    let resetToken = user.getResetPasswordToken();

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

      throw new ErrorResponse('Email could not be sent', 500);
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   PUT /api/v1/user/resetpassword/:resettoken
// @access  Public

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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

    if (!user) throw new ErrorResponse('Invalid token', 400);

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/v1/user/logout
// @access  Private
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
  });
};

// TODO Add cookie blacklisting

// @desc      Upload photo for logged in user
// @route     PUT /api/v1/user/profile/photo
// @access    Private
export const userPhotoUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.userExists(res.locals.user.id);

    // Check if there is a file to upload
    if (!req.files) throw new ErrorResponse(`Please upload a file`, 400);

    const file = req.files.file as UploadedFile;

    // Check if uploaded image is a photo

    if (!file.mimetype.startsWith('image'))
      throw new ErrorResponse(`Please upload an image file`, 400);

    // Check file size
    const maxFileSizeInBytes = (process.env
      .MAX_FILE_UPLOAD_BYTES as unknown) as number;
    const maxFileSizeInMB = maxFileSizeInBytes / 1048576; // 1 mb = 1048576 bytes

    if (file.size > maxFileSizeInBytes)
      throw new ErrorResponse(
        `Please upload an image less than ${maxFileSizeInMB}MB`,
        400
      );

    // Create custom filename
    file.name = `user_${user.id}${path.parse(file.name).ext}`;
    // Moving file to folder
    file.mv(
      `${process.env.FILE_UPLOAD_PATH}/users/${file.name}`,
      async (err: Error) => {
        if (err) {
          console.error(err);
          throw new ErrorResponse(`Problem with file upload`, 500);
        }

        await User.findByIdAndUpdate(res.locals.user.id, {
          photo: file.name,
        });

        res.status(200).json({
          success: true,
          data: file.name,
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Get products created by logged in user
// @route   GET /api/v1/profile/products
// @access  Private

export const myCreatedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = res.locals.user.id;
    const products = await Product.find({ addedById: user });

    // Check if logged in user has any created products
    if (products.length === 0)
      throw new ErrorResponse(`You have not added any products`, 404);

    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};
