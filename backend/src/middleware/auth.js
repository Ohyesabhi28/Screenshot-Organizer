import { findUserById } from '../models/database.js';

export function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const user = findUserById(token);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.userId = user.id;
  req.user = user;
  next();
}
