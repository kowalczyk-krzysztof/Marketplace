import jsonwebtoken from 'jsonwebtoken';
import asynchandler from 'express-async-handler';
import { ErrorResponse } from '../utils/ErrorResponse';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';

// Authorization via jsonwebtoken from cookie
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

    // else if (req.cookies.token) {
    //   token = req.cookies.token
    // }

    // Make sure token exists
    if (!token) {
      return next(
        new ErrorResponse('Not authorised to access this route', 401)
      );
    }
    try {
      // Verify token
      const secret = process.env.JWT_SECRET as jsonwebtoken.Secret;
      const decoded: any = jsonwebtoken.verify(token, secret);
      // Decoded will be in this format {id: string, iat: number, exp: number}

      // TODO - figure out how to handle type here

      req.user = await User.findById(decoded.id);

      next();
    } catch (err) {
      return next(
        new ErrorResponse('Not authorised to access this route', 401)
      );
    }
  }
);

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is unauthorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
