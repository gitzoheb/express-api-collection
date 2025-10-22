// Import jsonwebtoken for token verification
import jwt from 'jsonwebtoken';
// Import the User model to find the user associated with the token
import User from '../models/User.js';

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header is present and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from the header (Bearer TOKEN)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token and attach it to the request object
      // Exclude the password field for security
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // If token verification fails, send an error response
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is found, send an error response
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Export the protect middleware
export { protect };
