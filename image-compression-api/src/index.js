import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import * as cron from 'node-cron';
import { rateLimiter } from './middleware/rateLimiter.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import imageRoutes from './routes/imageRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { PORT, TEMP_DIR, CLEANUP_INTERVAL_MINUTES } from './config/config.js';
import { cleanupOldFiles } from './utils/cleanup.js';

const app = express();

// Add request ID tracking for all requests
app.use(requestIdMiddleware);

// Security headers with custom CSP to allow blob images
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"], // Allow blob URLs for compressed images
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// Enable CORS for cross-origin requests
app.use(cors());

// HTTP request logging with request ID
app.use(morgan('combined'));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all routes
app.use(rateLimiter);

// Image compression API routes
app.use('/api/images', imageRoutes);

// Serve compressed images from temp directory
app.use('/downloads', express.static(TEMP_DIR));

// Serve static frontend files
app.use(express.static('public'));

// Global error handling with request ID tracking
app.use(errorHandler);

// Schedule automatic cleanup of old files
cron.schedule(`*/${CLEANUP_INTERVAL_MINUTES} * * * *`, () => {
  console.log('Running scheduled cleanup...');
  cleanupOldFiles();
});

// Start server
app.listen(PORT, () => {
  console.log(`Image Compression API running on port ${PORT}`);
  console.log(`File cleanup scheduled every ${CLEANUP_INTERVAL_MINUTES} minutes`);
});