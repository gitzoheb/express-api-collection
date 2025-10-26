import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from '../config/config.js';
import { RateLimitError } from '../utils/errors.js';

/**
 * Rate limiting middleware to prevent API abuse
 * Limits requests per IP address within a time window
 */
export const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS, // Time window for rate limiting
  max: RATE_LIMIT_MAX_REQUESTS, // Max requests per window
  message: new RateLimitError('Too many requests, please try again later.'),
  standardHeaders: true, // Include rate limit info in headers
  legacyHeaders: false, // Disable deprecated headers
});