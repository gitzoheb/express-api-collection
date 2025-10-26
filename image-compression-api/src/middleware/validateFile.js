import multer from 'multer';
import { ALLOWED_MIMES, MAX_FILE_SIZE_BYTES, BATCH_SIZE_LIMIT } from '../config/config.js';

// Use memory storage to avoid disk I/O for small images
const storage = multer.memoryStorage();

// Filter to only allow supported image types
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and AVIF are allowed.'), false);
  }
  cb(null, true);
};

/**
 * Multer middleware for single image upload with validation
 */
export const validateFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES }
}).single('image');

/**
 * Multer middleware for multiple image uploads with configurable batch size limit
 */
export const validateFiles = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES }
}).array('images', BATCH_SIZE_LIMIT);