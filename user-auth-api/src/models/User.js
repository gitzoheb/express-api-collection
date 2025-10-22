// Import Mongoose for schema creation and model compilation
import mongoose from 'mongoose';
// Import bcryptjs for password hashing
import bcrypt from 'bcryptjs';

// Define the schema for the User model
const userSchema = mongoose.Schema(
  {
    // User's name
    name: {
      type: String,
      required: true, // Name is a required field
    },
    // User's email
    email: {
      type: String,
      required: true, // Email is a required field
      unique: true,   // Email must be unique
    },
    // User's password
    password: {
      type: String,
      required: true, // Password is a required field
    },
  },
  {
    // Automatically add `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Middleware to hash the user's password before saving it to the database
userSchema.pre('save', async function (next) {
  // If the password has not been modified, move to the next middleware
  if (!this.isModified('password')) {
    next();
  }

  // Generate a salt with 10 rounds
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the generated salt
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare an entered password with the user's hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Use bcrypt to compare the plain text password with the hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model
export default User;
