import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { TEMP_DIR, BASE_URL, ALLOWED_FORMATS, BATCH_SIZE_LIMIT } from '../config/config.js';
import { ValidationError, ProcessingError, StorageError, FileTooLargeError } from '../utils/errors.js';
import { withRetry } from '../utils/retry.js';

/**
 * Compress a single image with optional resizing and format conversion
 * @param {Object} req - Express request with file and body params
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
export const compress = async (req, res, next) => {
  const requestId = req.id;

  try {
    console.log(`[${requestId}] Starting image compression`);

    const { width, height, format = 'jpeg', quality = 80, fit = 'cover', download = 'false', uploadToStorage = 'false' } = req.body;
    const file = req.file;

    if (!file) {
      throw new ValidationError('No image file provided');
    }

    // Validate parameters
    if (width && (isNaN(width) || width <= 0)) {
      throw new ValidationError('Width must be a positive number');
    }
    if (height && (isNaN(height) || height <= 0)) {
      throw new ValidationError('Height must be a positive number');
    }
    if (quality && (isNaN(quality) || quality < 1 || quality > 100)) {
      throw new ValidationError('Quality must be between 1 and 100');
    }

    // Process image with retry logic for transient failures
    const result = await withRetry(async () => {
      let sharpInstance = sharp(file.buffer);

      // Apply resizing if dimensions specified
      if (width || height) {
        sharpInstance = sharpInstance.resize({
          width: width ? parseInt(width) : undefined,
          height: height ? parseInt(height) : undefined,
          fit: fit,
          withoutEnlargement: true
        });
      }

      // Set output format and quality
      const outputFormat = ALLOWED_FORMATS.includes(format) ? format : 'jpeg';
      sharpInstance = sharpInstance.toFormat(outputFormat, { quality: parseInt(quality) });

      return { sharpInstance, outputFormat };
    });

    const { sharpInstance, outputFormat } = result;
    const contentType = `image/${outputFormat}`;

    if (uploadToStorage === 'true') {
      // Save to temp directory and return download URL
      try {
        if (!fs.existsSync(TEMP_DIR)) {
          fs.mkdirSync(TEMP_DIR, { recursive: true });
        }
        const filename = `compressed_${Date.now()}.${outputFormat}`;
        const filepath = path.join(TEMP_DIR, filename);
        await sharpInstance.toFile(filepath);
        const downloadUrl = `${BASE_URL}/downloads/${filename}`;

        console.log(`[${requestId}] Image compressed and saved: ${filename}`);
        return res.json({ success: true, message: 'Image compressed and uploaded', data: { downloadUrl } });
      } catch (storageError) {
        if (storageError.code === 'ENOSPC') {
          throw new StorageError('Insufficient disk space for file storage');
        }
        throw new StorageError('Failed to save compressed image');
      }
    } else {
      // Stream compressed image directly to response
      console.log(`[${requestId}] Streaming compressed image`);
      res.setHeader('Content-Type', contentType);
      if (download === 'true') {
        res.setHeader('Content-Disposition', `attachment; filename="compressed.${outputFormat}"`);
      }
      sharpInstance.pipe(res);
    }
  } catch (error) {
    console.error(`[${requestId}] Compression failed:`, error.message);
    next(error);
  }
};

/**
 * Compress multiple images in batch
 * @param {Object} req - Express request with files and body params
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
/**
 * Compress multiple images in batch with memory optimization
 * Saves all results to temp storage and returns download URLs to avoid base64 memory usage
 * @param {Object} req - Express request with files and body params
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
export const batchCompress = async (req, res, next) => {
  const requestId = req.id;

  try {
    console.log(`[${requestId}] Starting batch compression`);

    const { width, height, format = 'jpeg', quality = 80, fit = 'cover' } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      throw new ValidationError('No image files provided');
    }

    if (files.length > BATCH_SIZE_LIMIT) {
      throw new ValidationError(`Too many files. Maximum ${BATCH_SIZE_LIMIT} files allowed per batch`);
    }

    // Validate parameters
    if (width && (isNaN(width) || width <= 0)) {
      throw new ValidationError('Width must be a positive number');
    }
    if (height && (isNaN(height) || height <= 0)) {
      throw new ValidationError('Height must be a positive number');
    }
    if (quality && (isNaN(quality) || quality < 1 || quality > 100)) {
      throw new ValidationError('Quality must be between 1 and 100');
    }

    // Ensure temp directory exists
    try {
      if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
      }
    } catch (dirError) {
      throw new StorageError('Failed to create temporary directory');
    }

    const results = [];
    const totalFiles = files.length;

    // Process files sequentially to avoid memory spikes
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`[${requestId}] Processing file ${i + 1}/${totalFiles}: ${file.originalname}`);

      try {
        // Process each file with retry logic
        const result = await withRetry(async () => {
          let sharpInstance = sharp(file.buffer);

          // Apply resizing if dimensions specified
          if (width || height) {
            sharpInstance = sharpInstance.resize({
              width: width ? parseInt(width) : undefined,
              height: height ? parseInt(height) : undefined,
              fit: fit,
              withoutEnlargement: true
            });
          }

          // Set output format and quality
          const outputFormat = ALLOWED_FORMATS.includes(format) ? format : 'jpeg';
          sharpInstance = sharpInstance.toFormat(outputFormat, { quality: parseInt(quality) });

          return { sharpInstance, outputFormat };
        });

        const { sharpInstance, outputFormat } = result;

        // Always save to temp storage for batch processing (memory optimization)
        const timestamp = Date.now();
        const filename = `batch_compressed_${timestamp}_${i}_${file.originalname}`;
        const filepath = path.join(TEMP_DIR, filename);

        await sharpInstance.toFile(filepath);
        const downloadUrl = `${BASE_URL}/downloads/${filename}`;

        results.push({
          originalName: file.originalname,
          downloadUrl,
          format: outputFormat,
          index: i + 1,
          total: totalFiles
        });

      } catch (fileError) {
        console.error(`[${requestId}] Failed to process ${file.originalname}:`, fileError.message);
        // Continue processing other files but mark this one as failed
        results.push({
          originalName: file.originalname,
          error: fileError.message,
          errorCode: fileError.errorCode || 'PROCESSING_ERROR',
          index: i + 1,
          total: totalFiles
        });
      }
    }

    const successCount = results.filter(r => !r.error).length;
    console.log(`[${requestId}] Batch compression completed: ${successCount}/${totalFiles} successful`);

    res.json({
      success: true,
      message: `Batch compression completed: ${successCount}/${totalFiles} successful`,
      data: results,
      requestId
    });
  } catch (error) {
    console.error(`[${requestId}] Batch compression failed:`, error.message);
    next(error);
  }
};