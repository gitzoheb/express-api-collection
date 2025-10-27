import express from 'express';
import { generatePassword, validatePassword } from '../controllers/passwordController.js';

const router = express.Router();

// Generate password
router.post('/generate', generatePassword);

// Validate password strength
router.post('/validate', validatePassword);

export default router;