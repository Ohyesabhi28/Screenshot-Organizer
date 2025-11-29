import express from 'express';
import crypto from 'crypto';
import { 
  createUser, 
  findUserByEmail, 
  findUserById 
} from '../models/database.js';

const router = express.Router();

// Hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate session token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    // Check if user exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Create user
    const hashedPassword = hashPassword(password);
    const token = generateToken();
    
    const user = createUser({
      email,
      password: hashedPassword,
      name,
      token
    });
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const hashedPassword = hashPassword(password);
    
    if (user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
      token: user.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const user = findUserById(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
