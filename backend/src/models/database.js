import fs from 'fs/promises';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || './database.json';
let db = { screenshots: [], users: [] };

export async function initDatabase() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    db = JSON.parse(data);
    if (!db.users) db.users = [];
  } catch (error) {
    db = { screenshots: [], users: [] };
    await saveDatabase();
  }
  console.log('Database initialized');
}

async function saveDatabase() {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export function insertScreenshot(data) {
  const id = db.screenshots.length > 0 
    ? Math.max(...db.screenshots.map(s => s.id)) + 1 
    : 1;
  
  const screenshot = {
    id,
    user_id: data.userId,
    filename: data.filename,
    filepath: data.filepath,
    extracted_text: data.extractedText,
    tags: data.tags,
    perceptual_hash: data.hash,
    width: data.width,
    height: data.height,
    size: data.size,
    created_at: new Date().toISOString()
  };
  
  db.screenshots.push(screenshot);
  saveDatabase();
  
  return { lastInsertRowid: id };
}

export function getAllScreenshots(userId, limit = 100, offset = 0) {
  return db.screenshots
    .filter(s => s.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(offset, offset + limit);
}

export function getScreenshotById(id) {
  return db.screenshots.find(s => s.id === parseInt(id));
}

export function searchScreenshots(userId, query) {
  const lowerQuery = query.toLowerCase();
  return db.screenshots
    .filter(s => 
      s.user_id === userId &&
      (s.extracted_text?.toLowerCase().includes(lowerQuery) ||
      s.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)))
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function findDuplicateByHash(hash) {
  return db.screenshots.find(s => s.perceptual_hash === hash);
}

export function deleteScreenshot(id) {
  const index = db.screenshots.findIndex(s => s.id === parseInt(id));
  if (index !== -1) {
    db.screenshots.splice(index, 1);
    saveDatabase();
  }
}


// User functions
export function createUser(data) {
  const id = db.users.length > 0 
    ? Math.max(...db.users.map(u => u.id)) + 1 
    : 1;
  
  const user = {
    id,
    email: data.email,
    password: data.password,
    name: data.name,
    token: data.token,
    created_at: new Date().toISOString()
  };
  
  db.users.push(user);
  saveDatabase();
  
  return user;
}

export function findUserByEmail(email) {
  return db.users.find(u => u.email === email);
}

export function findUserById(token) {
  return db.users.find(u => u.token === token);
}
