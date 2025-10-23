import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import translateRoutes from './routes/translate.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('src/public'));

app.use('/translate', translateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});