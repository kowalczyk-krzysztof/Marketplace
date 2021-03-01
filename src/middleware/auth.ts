import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import asynchandler from 'express-async-handler';
import { ErrorResponse } from '../utils/ErrorResponse';
import User from '../models/User';

// Authorization via jsonwebtoken from cookie
// Any routes that use protect will have acess to user and its properties
export const protect = asynchandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      // Gets the token without Bearer
    }
    // TODO
    // else if (req.cookies.token) {
    //   token = req.cookies.token
    // }

    // Check if token exists
    if (!token) {
      return next(
        new ErrorResponse('Not authorized to access this route', 401)
      );
    }
    try {
      // Verify token
      const secret = process.env.JWT_SECRET as jsonwebtoken.Secret;
      const decoded: any = jsonwebtoken.verify(token, secret);
      // decoded will be in this format {id: string, iat: number, exp: number}

      // TODO - figure out how to handle type here

      req.user = await User.findById(decoded.id);

      next();
    } catch (err) {
      return next(
        new ErrorResponse('Not authorized to access this route', 401)
      );
    }
  }
);

// Grant access to specific roles - NOTE: ROLE NAMES ARE CASE SENSITIVE!
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User with role of ${req.user.role} is unauthorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
