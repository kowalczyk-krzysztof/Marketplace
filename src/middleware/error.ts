import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Log to console for dev
  console.log(err.stack);

  res.status(500).json({
    success: false,
    error: err.message,
  });
};

export default errorHandler;
