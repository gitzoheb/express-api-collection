// Import the Express router
import express from 'express';
const router = express.Router();

// Import controller functions for handling user registration, login, and profile retrieval
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';

// Import the 'protect' middleware to secure routes
import { protect } from '../middleware/authMiddleware.js';

// Define the route for user registration
// POST /api/users/register
router.post('/register', registerUser);

// Define the route for user login
// POST /api/users/login
router.post('/login', loginUser);

// Define the route for getting the user profile
// This route is protected, meaning a valid JWT is required
// GET /api/users/profile
router.get('/profile', protect, getUserProfile);

// Export the router to be used in the main server file
export default router;
