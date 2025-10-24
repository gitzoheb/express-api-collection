import formatResponse from '../utils/responseFormatter.js';

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // In development, log the error
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json(formatResponse(false, message, statusCode));
};

export default errorMiddleware;