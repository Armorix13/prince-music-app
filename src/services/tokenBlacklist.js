// Token blacklist service
import { User } from '../model/user.model.js';

class TokenBlacklistService {
  constructor() {
    // In-memory blacklist (for production, use Redis)
    this.blacklist = new Set();
  }

  // Add token to blacklist
  addToBlacklist(token) {
    this.blacklist.add(token);
  }

  // Check if token is blacklisted
  isBlacklisted(token) {
    return this.blacklist.has(token);
  }

  // Remove expired tokens from blacklist (cleanup)
  cleanupExpiredTokens() {
    // This is a simple implementation
    // In production, you'd want to store expiration times
    // and clean up based on actual JWT expiration
    if (this.blacklist.size > 10000) {
      this.blacklist.clear();
    }
  }

  // Get blacklist size (for monitoring)
  getBlacklistSize() {
    return this.blacklist.size;
  }
}

export const tokenBlacklist = new TokenBlacklistService();
