import express from 'express';
import path from 'path';
import pollRoutes from './routes/poll.routes.js';

const app = express();

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/polls', pollRoutes);

// Error handling middleware
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));