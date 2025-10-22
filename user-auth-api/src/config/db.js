// Import Mongoose for MongoDB object modeling
import mongoose from 'mongoose';

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to the database using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true, // Use the new unified topology engine
      useNewUrlParser: true,    // Use the new URL string parser
    });

    // Log a success message with the host name upon successful connection
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log an error message and exit the process if the connection fails
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

// Export the connectDB function to be used in other parts of the application
export default connectDB;
