import { ErrorRequestHandler } from 'express';
import { ErrorResponse } from '../utils/errorResponse';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // Log to console for dev
  console.log(err);
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .toString()
      .split(',')
      .join(' | ');
    // TODO1: Figure out the type here
    // TODO2: Find a better way of handling this. Currently it is done like that because errorResponse has to return a string
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
