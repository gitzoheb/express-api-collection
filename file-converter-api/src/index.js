import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import converterRoutes from './routes/converterRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', converterRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'File Converter API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});