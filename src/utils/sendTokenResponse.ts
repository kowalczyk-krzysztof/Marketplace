import User from '../models/User';
import { Response } from 'express';

// Get token from model, create cookie and send response
export const sendTokenResponse = (
  user: User,
  statusCode: number,
  res: Response
) => {
  const token: string = user.getSignedJwtToken(); // jsonwebtoken
  const expireTime = (process.env.JWT_COOKIE_EXPIRE as unknown) as number;
  // Cookie options
  const options = {
    expires: new Date(Date.now() + expireTime * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === 'production') options.secure = true;

  res.status(statusCode).cookie('token', token, options).json({
    succcess: true,
    token,
  });
};
