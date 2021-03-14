import { Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';
import path from 'path';
import crypto from 'crypto';

import User from '../models/User';
import { UploadedFile } from 'express-fileupload';
import { ErrorResponse } from '../utils/ErrorResponse';
import { sendEmail } from '../utils/sendEmail';

// @desc    Register user
// @route   POST /api/v1/user/register
// @access  Public

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(201).json({
      success: true,
      message: 'Account created. Please verify your email',
    });
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
    const user: User = req.user as User;

    const token: string = user.getSignedJwtToken(); // jsonwebtoken

    const expireTime: number = (process.env
      .JWT_COOKIE_EXPIRE as unknown) as number;
    const expiresIn: string = process.env.JWT_EXPIRE as string;
    // Cookie options
    const options = {
      expires: new Date(Date.now() + expireTime * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    };

    if (process.env.NODE_ENV === 'production') options.secure = true;

    res.status(200).cookie('token', token, options).json({
      success: true,
      token: token,
      expiresIn,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/v1/user/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  req.logout();
  res.status(200).json({
    success: true,
  });
};

// @desc    Get logged in user
// @route   GET /api/v1/user/profile
// @access  Private
export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: User = req.user as User;

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
    const user = req.user as User;

    // Check if user is trying to register as admin
    if (req.body.role === 'ADMIN')
      new ErrorResponse('You can not set role to ADMIN', 401);

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    await user.save();

    res.status(201).json({ sucess: true, data: user });
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
    const loggedInUser: User = req.user as User;
    const user: User | null = await User.findById(loggedInUser.id).select(
      '+password'
    );

    // Check current password

    if (!(await user?.matchPassword(req.body.currentPassword)))
      throw new ErrorResponse('Password is incorrect', 401);

    loggedInUser.password = req.body.newPassword;
    await loggedInUser.save();

    res.status(201).json({ succcess: true });
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
    const user: User | null = await User.findOne({ email: req.body.email });

    // Check is user exists
    if (!user)
      throw new ErrorResponse(
        `There is no user with email ${req.body.email}`,
        404
      );
    // Get reset token
    let resetToken: string = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl: string = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/user/resetpassword/${resetToken}`;
    // Create message to pass, in actual frontend you want to put an actual link inside

    const message: string = `You are receiving this email because you (or someone else) has requested the reset of a password. Please visit: \n\n${resetUrl}`;
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
      // If something goes wrong then delete the token and expire from database
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
    const resetPasswordToken: string = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user: User | null = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // is greater than Date.now()
    });

    if (!user) throw new ErrorResponse('Invalid token', 400);

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({ succcess: true });
  } catch (err) {
    next(err);
  }
};

// @desc      Upload photo for logged in user
// @route     PUT /api/v1/user/profile/photo
// @access    Private
export const userPhotoUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: User = req.user as User;

    // Check if there is a file to upload
    if (!req.files) throw new ErrorResponse(`Please upload a file`, 400);

    const file: UploadedFile = req.files.file as UploadedFile;

    // Check if uploaded image is a photo

    if (!file.mimetype.startsWith('image'))
      throw new ErrorResponse(`Please upload an image file`, 400);

    // Check file size
    const maxFileSizeInBytes: number = (process.env
      .MAX_FILE_UPLOAD_BYTES as unknown) as number;
    const maxFileSizeInMB: number = maxFileSizeInBytes / 1048576; // 1 mb = 1048576 bytes

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
        user.photo = file.name;
        await user.save();

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
    const user: User = req.user as User;
    await user.populate('addedProducts').execPopulate();
    const myProducts: ObjectID[] = user.addedProducts;

    // Check if logged in user has any created products
    if (myProducts.length === 0)
      throw new ErrorResponse(`You have not added any products`, 404);

    res.status(200).json({
      success: true,
      count: myProducts.length,
      data: user.addedProducts,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify email
// @route   PUT /api/v1/user/verifyemail/:resettoken
// @access  Public

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get hashed token from unhashed req.params.resettoken
    const verifyEmailToken: string = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user: User | null = await User.findOne({
      verifyEmailToken,
      verifyEmailTokenExpire: { $gt: Date.now() }, // is greater than Date.now()
    });

    if (!user) throw new ErrorResponse('Invalid token', 400);

    // Verify user
    user.verifiedEmail = 'VERIFIED';
    user.verifyEmailToken = undefined;
    user.verifyEmailTokenExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      data: 'Your email address has been successfully verified',
    });
  } catch (err) {
    next(err);
  }
};
// @desc    Resend verification email
// @route   PUT /api/v1/user/verifyemail/resend
// @access  Public
export const resendVerifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: User = req.user as User;

    if (user.verifiedEmail === 'VERIFIED')
      throw new ErrorResponse('Email is already verified', 400);

    // Get reset token
    const [token, hashedToken, tokenExpiration] = User.getVerifyEmailToken();

    user.verifyEmailToken = hashedToken;
    user.verifyEmailTokenExpire = tokenExpiration;

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl: string = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/user/verifyemail/${token}`;
    const message: string = `Your email verification link\n\n${resetUrl}\n\nExpires in 24 hours`;
    try {
      // Passing options
      await sendEmail({
        email: user.email,
        subject: 'Email verification',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      // If something goes wrong then delete the token and expire from database
      user.verifyEmailToken = undefined;
      user.verifyEmailTokenExpire = undefined;

      await user.save({ validateBeforeSave: false });

      throw new ErrorResponse('Email could not be sent', 500);
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/v1/user/:id
// @access  Public
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Finds a single user
    const userID: ObjectID = (req.params.id as unknown) as ObjectID;
    const findUser: User = await User.userExists(userID);
    await findUser
      .populate('addedProducts', '_id name description')
      .execPopulate();

    res.status(200).json({ sucess: true, data: findUser });
  } catch (err) {
    next(err);
  }
};
