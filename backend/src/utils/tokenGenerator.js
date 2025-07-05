import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function generateDownloadToken(purchaseLogId, bookId) {
  const payload = {
    purchaseLogId,
    bookId,
    type: 'download',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, process.env.DOWNLOAD_TOKEN_SECRET);
}

export function verifyDownloadToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.DOWNLOAD_TOKEN_SECRET);
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

export function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

export function generateApiKey(prefix = 'da') {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(16).toString('hex');
  return `${prefix}_${timestamp}_${random}`;
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}