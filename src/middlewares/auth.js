import { jwtUtils, securityUtils } from '../utils/helpers.js';
import { UnauthorizedError, ForbiddenError } from '../utils/customError.js';
import { User } from '../model/user.model.js';

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      throw new UnauthorizedError('Access denied. No token provided.');
    }
    
    // Verify token
    const decoded = jwtUtils.verifyAccessToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new UnauthorizedError('Token is valid but user no longer exists.');
    }
    
    // Check if user is active
    if (!user.isActive) {
      throw new ForbiddenError('Account is deactivated.');
    }
    
    // Check if user is blocked
    if (user.isBlocked) {
      throw new ForbiddenError('Account is blocked.');
    }
    
    // Check if account is locked
    if (user.isAccountLocked()) {
      throw new ForbiddenError('Account is temporarily locked due to multiple failed login attempts.');
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      try {
        const decoded = jwtUtils.verifyAccessToken(token);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive && !user.isBlocked && !user.isAccountLocked()) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't throw error in optional auth
        console.log('Optional auth token invalid:', error.message);
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required.');
    }
    
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(`Access denied. Required role: ${roles.join(' or ')}`);
    }
    
    next();
  };
};

// Email verification middleware
export const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required.');
  }
  
  if (!req.user.isEmailVerified) {
    throw new ForbiddenError('Email verification required.');
  }
  
  next();
};

// Phone verification middleware
export const requirePhoneVerification = (req, res, next) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required.');
  }
  
  if (!req.user.isPhoneVerified) {
    throw new ForbiddenError('Phone verification required.');
  }
  
  next();
};

// Rate limiting middleware
export const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = securityUtils.generateRateLimitKey(req);
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    if (requests.has(key)) {
      const userRequests = requests.get(key).filter(time => time > windowStart);
      requests.set(key, userRequests);
    } else {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key);
    
    if (userRequests.length >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    userRequests.push(now);
    next();
  };
};

// Login rate limiting (stricter)
export const loginRateLimit = createRateLimit(15 * 60 * 1000, 5); // 5 attempts per 15 minutes

// General API rate limiting
export const apiRateLimit = createRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Password reset rate limiting
export const passwordResetRateLimit = createRateLimit(60 * 60 * 1000, 3); // 3 attempts per hour

// Email verification rate limiting
export const emailVerificationRateLimit = createRateLimit(60 * 60 * 1000, 5); // 5 attempts per hour

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

// Input sanitization middleware
export const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = securityUtils.sanitizeInput(req.body[key]);
        
        // Check for SQL injection
        if (securityUtils.detectSQLInjection(req.body[key])) {
          return res.status(400).json({
            success: false,
            message: 'Invalid input detected'
          });
        }
      }
    }
  }
  
  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = securityUtils.sanitizeInput(req.query[key]);
        
        if (securityUtils.detectSQLInjection(req.query[key])) {
          return res.status(400).json({
            success: false,
            message: 'Invalid input detected'
          });
        }
      }
    }
  }
  
  next();
};

// Device tracking middleware
export const trackDevice = (req, res, next) => {
  req.deviceInfo = {
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown'
  };
  
  next();
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id || 'anonymous',
      timestamp: new Date().toISOString()
    };
    
    console.log(JSON.stringify(logData));
  });
  
  next();
};
