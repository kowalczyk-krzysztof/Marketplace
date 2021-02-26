import { RequestHandler } from 'express';
import UserSchema from '../models/User';
import asyncHandler from 'express-async-handler';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register: RequestHandler = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await UserSchema.create({
    name,
    email,
    password,
    role,
  });

  // Create token
  const token = user.getSignedJwtToken();
  res.status(200).json({ sucess: true, token });
});
