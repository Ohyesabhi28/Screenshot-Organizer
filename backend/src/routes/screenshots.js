import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { processScreenshot } from '../services/imageProcessor.js';
import { 
  insertScreenshot, 
  getAllScreenshots, 
  getScreenshotById, 
  searchScreenshots,
  deleteScreenshot 
} from '../models/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = './uploads';
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Upload screenshot
router.post('/', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await processScreenshot(req.file.path, req.file.filename);
    result.userId = req.userId; // Add user ID to screenshot
    
    const insertResult = insertScreenshot(result);
    
    res.json({
      id: insertResult.lastInsertRowid,
      ...result
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all screenshots (user-specific)
router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const screenshots = getAllScreenshots(req.userId, limit, offset);
    res.json(screenshots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search screenshots (user-specific)
router.get('/search', (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const results = searchScreenshots(req.userId, query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single screenshot (user-specific)
router.get('/:id', (req, res) => {
  try {
    const screenshot = getScreenshotById(req.params.id);
    
    if (!screenshot) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }
    
    // Check if screenshot belongs to user
    if (screenshot.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(screenshot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete screenshot (user-specific)
router.delete('/:id', async (req, res) => {
  try {
    const screenshot = getScreenshotById(req.params.id);
    
    if (!screenshot) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }
    
    // Check if screenshot belongs to user
    if (screenshot.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Delete file
    await fs.unlink(screenshot.filepath);
    
    // Delete from database
    deleteScreenshot(req.params.id);
    
    res.json({ message: 'Screenshot deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
