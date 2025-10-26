import express from 'express';
import { compress, batchCompress } from '../controllers/imageController.js';
import { validateFile, validateFiles } from '../middleware/validateFile.js';
import { performCleanup, getStorageStats } from '../utils/cleanup.js';

/**
 * Image compression routes
 * - POST /compress: Single image compression
 * - POST /compress/batch: Multiple image compression
 * - GET /health: Health check endpoint
 * - DELETE /admin/cleanup: Manual cleanup (admin only)
 * - GET /admin/stats: Storage statistics (admin only)
 */
const router = express.Router();

// Single image compression with file validation
router.post('/compress', validateFile, compress);

// Batch image compression with multiple file validation
router.post('/compress/batch', validateFiles, batchCompress);

// Simple health check
router.get('/health', (req, res) => res.json({ status: 'ok' }));

// Admin routes for cleanup and monitoring
router.delete('/admin/cleanup', (req, res) => {
  try {
    const customRetention = req.query.retention ? parseInt(req.query.retention) : null;
    const result = performCleanup(customRetention);
    res.json({
      success: true,
      message: 'Cleanup completed',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cleanup failed',
      error: error.message
    });
  }
});

router.get('/admin/stats', (req, res) => {
  try {
    const stats = getStorageStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get storage stats',
      error: error.message
    });
  }
});

export default router;