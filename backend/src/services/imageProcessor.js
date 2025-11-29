import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import crypto from 'crypto';
import { findDuplicateByHash } from '../models/database.js';

export async function processScreenshot(filepath, filename) {
  // Get image metadata
  const metadata = await sharp(filepath).metadata();
  
  // Generate simple hash for duplicate detection (using resized image)
  const resizedBuffer = await sharp(filepath)
    .resize(64, 64, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer();
  
  const hash = crypto.createHash('md5').update(resizedBuffer).digest('hex');
  
  // Check for duplicates
  const duplicate = findDuplicateByHash(hash);
  if (duplicate) {
    console.log(`Duplicate found: ${duplicate.filename}`);
  }
  
  // Extract text using OCR
  const { data: { text } } = await Tesseract.recognize(filepath, 'eng', {
    logger: m => console.log(m)
  });
  
  // Generate tags based on extracted text
  const tags = generateTags(text);
  
  return {
    filename,
    filepath,
    extractedText: text.trim(),
    tags,
    hash,
    width: metadata.width,
    height: metadata.height,
    size: metadata.size,
    isDuplicate: !!duplicate,
    duplicateOf: duplicate?.id
  };
}

function generateTags(text) {
  const tags = [];
  const lowerText = text.toLowerCase();
  
  // Common patterns
  const patterns = {
    code: /function|const|let|var|import|export|class|def|print/,
    error: /error|exception|failed|warning/,
    email: /@[\w.-]+\.\w+/,
    url: /https?:\/\//,
    date: /\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}/,
    terminal: /\$|>|bash|shell|command/,
    browser: /chrome|firefox|safari|edge/,
    document: /document|pdf|word|excel/
  };
  
  for (const [tag, pattern] of Object.entries(patterns)) {
    if (pattern.test(lowerText)) {
      tags.push(tag);
    }
  }
  
  // Add generic tag if no specific tags found
  if (tags.length === 0) {
    tags.push('general');
  }
  
  return tags;
}
