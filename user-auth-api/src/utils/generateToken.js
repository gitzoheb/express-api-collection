// Import jsonwebtoken for creating JWTs
import jwt from 'jsonwebtoken';

// Function to generate a JWT for a user
const generateToken = (id) => {
  // Sign a new token with the user's ID, using the secret from environment variables
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // Set the token to expire in 30 days
    expiresIn: '30d',
  });
};

// Export the generateToken function
export default generateToken;
