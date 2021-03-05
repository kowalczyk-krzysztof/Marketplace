import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';
import User from '../models/User';

// Grant access to specific roles - NOTE: ROLE NAMES ARE CASE SENSITIVE!
export const roles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDetails = req.user as User;
      const user = userDetails.role;
      if (!roles.includes(user))
        throw new ErrorResponse(
          `User with role of ${user} is unauthorized to access this route`,
          403
        );
      next();
    } catch (err) {
      next(err);
    }
  };
};
