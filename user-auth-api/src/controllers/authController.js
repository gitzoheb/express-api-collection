// Import the User model for database interaction
import User from '../models/User.js';
// Import the token generation utility
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  // Destructure name, email, and password from the request body
  const { name, email, password } = req.body;

  try {
    // Check if a user with the given email already exists
    const userExists = await User.findOne({ email });

    // If the user exists, return a 400 Bad Request response
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user with the provided details
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by the pre-save middleware in the User model
    });

    // If the user is created successfully, return the user's info and a token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id), // Generate a JWT for the new user
      });
    } else {
      // If user creation fails, return a 400 Bad Request response
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // Handle any other errors
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user exists and the password matches, return the user's info and a token
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id), // Generate a JWT for the logged-in user
      });
    } else {
      // If authentication fails, return a 401 Unauthorized response
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    // Handle any other errors
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // The user object is attached to the request by the 'protect' middleware
  const user = req.user;

  // If the user is found, return their information
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    // If no user is found, return a 404 Not Found response
    res.status(404).json({ message: 'User not found' });
  }
};

// Export the controller functions
export { registerUser, loginUser, getUserProfile };
