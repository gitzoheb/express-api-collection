import express from 'express';
import { getMetadata, getMetadataWithScreenshot, healthCheck } from '../controllers/scrapeController.js';

const router = express.Router();

// Health check endpoint
router.get('/health', healthCheck);

// Get metadata from URL
router.get('/metadata', getMetadata);

// Get metadata with screenshot
router.get('/metadata/screenshot', getMetadataWithScreenshot);

export default router;

