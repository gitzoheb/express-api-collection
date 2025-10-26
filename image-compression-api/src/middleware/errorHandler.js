/**
 * Centralized error handling middleware
 * Logs errors and returns consistent JSON error responses
 */
/**
 * Enhanced error handler with request ID tracking and detailed logging
 */
export const errorHandler = (err, req, res, next) => {
  const requestId = req.id || 'unknown';

  // Log detailed error information
  console.error(`[${requestId}] Error:`, {
    message: err.message,
    errorCode: err.errorCode || 'UNKNOWN_ERROR',
    statusCode: err.statusCode || 500,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  // Send structured error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errorCode: err.errorCode || 'INTERNAL_ERROR',
    requestId,
    statusCode: err.statusCode || 500
  });
};