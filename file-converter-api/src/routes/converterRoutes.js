import express from 'express';
import multer from 'multer';
import { convertPdfToImage, convertDocxToPdf } from '../controllers/converterController.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});

// Routes
router.post('/convert/pdf-to-image', upload.single('file'), convertPdfToImage);
router.post('/convert/docx-to-pdf', upload.single('file'), convertDocxToPdf);

export default router;