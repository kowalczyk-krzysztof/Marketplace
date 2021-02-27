import { ErrorRequestHandler } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';

const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  let error = { ...err };
  error.message = err._message;

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
    const message = Object.values(err.errors).toString();
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
