import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import converterRoutes from './routes/converter.routes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', converterRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Currency Converter API running on port ${PORT}`);
});