import dotenv from "dotenv";
dotenv.config();

import express from "express";
import loggingMiddleware from "./middleware/loggingMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/product.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Serve static files
app.use(express.static("public"));

// Routes
app.use("/api/products", productRoutes);

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
