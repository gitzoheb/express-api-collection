import express from 'express';
import { generateQR, downloadQR } from '../controllers/qrController.js';

const router = express.Router();

// GET /api/generate?text=hello&size=256&format=png
router.get('/generate', generateQR);

// GET /api/download?text=hello&size=256
router.get('/download', downloadQR);

export default router;