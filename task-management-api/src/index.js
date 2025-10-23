import express from 'express';
import taskRoutes from './routes/task.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from public folder

// Routes
app.use('/tasks', taskRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Task Management API running on port ${PORT}`);
});