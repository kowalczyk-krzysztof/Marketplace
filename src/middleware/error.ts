import { Request, Response, NextFunction } from 'express';
import colors from 'colors';

import { ErrorResponse } from '../utils/ErrorResponse';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;
  // Uses the message passed to next() in the controller, for example `Product not found with _id: ${req.params.id}`

  // Log to console for dev
  console.log(colors.white.bgRed.bold(err));

  // Mongoose invalid ObjectId
  if (err.kind === 'ObjectId') {
    const message = `Invalid id format`;
    error = new ErrorResponse(message, 404);
  }
  // If someone is trying to NoSQL inject
  if (err.kind === 'string') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).toString();
    error = new ErrorResponse(message, 400);
  }
  // Mongoose Syntax Error
  if (err.type === 'entity.parse.failed') {
    const message = `Syntax Error`;
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json(error.message || err._message || 'Server error');
};

export default errorHandler;
