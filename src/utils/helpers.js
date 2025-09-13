import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Password utilities
export const passwordUtils = {
  // Hash password with salt rounds
  async hashPassword(password) {
    try {
      if (!password || typeof password !== 'string') {
        throw new Error('Password must be a non-empty string');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      const saltRounds = 12;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  },

  // Compare password with hash
  async comparePassword(password, hashedPassword) {
    try {
      if (!password || !hashedPassword) {
        throw new Error('Both password and hash are required');
      }
      
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Password comparison failed: ${error.message}`);
    }
  },

  // Validate password strength
  validatePasswordStrength(password) {
    const errors = [];
    
    if (!password || typeof password !== 'string') {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password cannot exceed 128 characters');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common weak patterns
    const commonPatterns = [
      /(.)\1{2,}/, // Repeated characters
      /123|234|345|456|567|678|789|890/, // Sequential numbers
      /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i, // Sequential letters
      /password|123456|qwerty|admin|letmein/i // Common passwords
    ];
    
    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        errors.push('Password contains weak patterns');
        break;
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password)
    };
  },

  // Calculate password strength score
  calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    if (password.length >= 16) score += 1;
    
    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong', 'Excellent'];
    return strengthLevels[Math.min(score, strengthLevels.length - 1)];
  }
};

// JWT utilities
export const jwtUtils = {
  // Generate access token
  generateAccessToken(payload) {
    try {
      if (!payload || typeof payload !== 'object') {
        throw new Error('Payload must be a valid object');
      }
      
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
      }
      
      const options = {
        expiresIn: process.env.JWT_EXPIRE || '15m',
        issuer: process.env.JWT_ISSUER || 'prince-music-app',
        audience: process.env.JWT_AUDIENCE || 'prince-music-users'
      };
      
      return jwt.sign(payload, secret, options);
    } catch (error) {
      throw new Error(`Access token generation failed: ${error.message}`);
    }
  },

  // Generate refresh token
  generateRefreshToken(payload) {
    try {
      if (!payload || typeof payload !== 'object') {
        throw new Error('Payload must be a valid object');
      }
      
      const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT refresh secret is not set');
      }
      
      const options = {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
        issuer: process.env.JWT_ISSUER || 'prince-music-app',
        audience: process.env.JWT_AUDIENCE || 'prince-music-users'
      };
      
      return jwt.sign(payload, secret, options);
    } catch (error) {
      throw new Error(`Refresh token generation failed: ${error.message}`);
    }
  },

  // Verify access token
  verifyAccessToken(token) {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Token must be a non-empty string');
      }
      
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
      }
      
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token');
      } else {
        throw new Error(`Token verification failed: ${error.message}`);
      }
    }
  },

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Token must be a non-empty string');
      }
      
      const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT refresh secret is not set');
      }
      
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      } else {
        throw new Error(`Refresh token verification failed: ${error.message}`);
      }
    }
  },

  // Decode token without verification (for debugging)
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw new Error(`Token decoding failed: ${error.message}`);
    }
  }
};

// Email utilities
export const emailUtils = {
  // Validate email format
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    if (email.length > 254) {
      return { isValid: false, error: 'Email is too long' };
    }
    
    return { isValid: true };
  },

  // Normalize email
  normalizeEmail(email) {
    if (!email || typeof email !== 'string') {
      return email;
    }
    
    return email.toLowerCase().trim();
  }
};

// Phone utilities
export const phoneUtils = {
  // Validate phone number
  validatePhoneNumber(phoneNumber, countryCode) {
    if (!phoneNumber || !countryCode) {
      return { isValid: false, error: 'Phone number and country code are required' };
    }
    
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 7 || cleanNumber.length > 15) {
      return { isValid: false, error: 'Invalid phone number length' };
    }
    
    // Basic country code validation
    const validCountryCodes = ['+1', '+44', '+91', '+86', '+33', '+49', '+81', '+61', '+55', '+7'];
    if (!validCountryCodes.includes(countryCode)) {
      return { isValid: false, error: 'Invalid country code' };
    }
    
    return { isValid: true, formattedNumber: `${countryCode}${cleanNumber}` };
  },

  // Format phone number
  formatPhoneNumber(phoneNumber, countryCode) {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return `${countryCode}${cleanNumber}`;
  }
};

// Date utilities
export const dateUtils = {
  // Validate date of birth
  validateDateOfBirth(dob) {
    if (!dob) {
      return { isValid: false, error: 'Date of birth is required' };
    }
    
    const date = new Date(dob);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }
    
    if (date > now) {
      return { isValid: false, error: 'Date of birth cannot be in the future' };
    }
    
    const age = now.getFullYear() - date.getFullYear();
    if (age < 13) {
      return { isValid: false, error: 'Must be at least 13 years old' };
    }
    
    if (age > 120) {
      return { isValid: false, error: 'Invalid age' };
    }
    
    return { isValid: true, age };
  },

  // Format date
  formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) return null;
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }
};

// Security utilities
export const securityUtils = {
  // Generate secure random string
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  },

  // Generate UUID
  generateUUID() {
    return uuidv4();
  },

  // Sanitize input
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  },

  // Check for SQL injection patterns
  detectSQLInjection(input) {
    if (typeof input !== 'string') return false;
    
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\#|\/\*|\*\/)/,
      /(\b(OR|AND)\b.*=.*=)/i,
      /(\b(OR|AND)\b.*\d+\s*=\s*\d+)/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  },

  // Rate limiting key generator
  generateRateLimitKey(req) {
    return `${req.ip}-${req.route?.path || req.path}`;
  }
};

// OTP utilities
export const otpUtils = {
  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Generate OTP with custom length
  generateCustomOTP(length = 6) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  },

  // Validate OTP format
  validateOTPFormat(otp) {
    if (!otp || typeof otp !== 'string') {
      return { isValid: false, error: 'OTP is required' };
    }
    
    if (!/^\d{6}$/.test(otp)) {
      return { isValid: false, error: 'OTP must be exactly 6 digits' };
    }
    
    return { isValid: true };
  },

  // Check if OTP is expired
  isOTPExpired(otpCreatedAt, expiryMinutes = 10) {
    if (!otpCreatedAt) return true;
    
    const now = new Date();
    const createdAt = new Date(otpCreatedAt);
    const expiryTime = new Date(createdAt.getTime() + (expiryMinutes * 60 * 1000));
    
    return now > expiryTime;
  },

  // Get OTP expiry time
  getOTPExpiryTime(expiryMinutes = 10) {
    const now = new Date();
    return new Date(now.getTime() + (expiryMinutes * 60 * 1000));
  },

  // Format OTP expiry time
  formatOTPExpiryTime(expiryTime) {
    const now = new Date();
    const diff = expiryTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

// Response utilities
export const responseUtils = {
  // Success response
  success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  },

  // Error response
  error(res, message, statusCode = 400, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  },

  // Paginated response
  paginated(res, message, data, pagination) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: Math.ceil(pagination.total / pagination.limit),
        hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
        hasPrev: pagination.page > 1
      },
      timestamp: new Date().toISOString()
    });
  }
};
