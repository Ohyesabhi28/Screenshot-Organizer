import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './models/database.js';
import screenshotRoutes from './routes/screenshots.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Initialize database
await initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/screenshots', screenshotRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
