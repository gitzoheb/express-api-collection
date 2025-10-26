import dotenv from 'dotenv';

dotenv.config();

/** Server port, defaults to 3000 */
export const PORT = process.env.PORT || 3000;

/** Base URL for generating download links, defaults to localhost */
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/** Maximum allowed file size in bytes (10MB default) */
export const MAX_FILE_SIZE_BYTES = parseInt(process.env.MAX_FILE_SIZE_BYTES) || 10 * 1024 * 1024;

/** Directory for temporary compressed file storage */
export const TEMP_DIR = process.env.TEMP_DIR || './temp';

/** Rate limit window in milliseconds (15 minutes default) */
export const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;

/** Maximum requests per rate limit window */
export const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

/** Maximum number of files allowed in batch processing */
export const BATCH_SIZE_LIMIT = parseInt(process.env.BATCH_SIZE_LIMIT) || 10;

/** File retention period in hours before cleanup */
export const FILE_RETENTION_HOURS = parseInt(process.env.FILE_RETENTION_HOURS) || 24;

/** Cleanup check interval in minutes */
export const CLEANUP_INTERVAL_MINUTES = parseInt(process.env.CLEANUP_INTERVAL_MINUTES) || 60;

/** Supported output image formats */
export const ALLOWED_FORMATS = ['jpeg', 'png', 'webp', 'avif'];

/** Allowed input MIME types for image validation */
export const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];