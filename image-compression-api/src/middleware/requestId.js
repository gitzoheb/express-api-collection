import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to generate and track unique request IDs
 * Adds request ID to req object and response headers for debugging
 */
export const requestIdMiddleware = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};