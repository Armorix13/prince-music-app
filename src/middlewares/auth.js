import { jwtUtils, securityUtils } from '../utils/helpers.js';
import { UnauthorizedError, ForbiddenError } from '../utils/customError.js';
import { User } from '../model/user.model.js';
import { tokenBlacklist } from '../services/tokenBlacklist.js';

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

    // Check if token is blacklisted (invalidated)
    if (tokenBlacklist.isBlacklisted(token)) {
      throw new UnauthorizedError('Token has been invalidated. Please login again.');
    }

    // Verify token
    const decoded = jwtUtils.verifyAccessToken(token);

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new UnauthorizedError('Token is valid but user no longer exists.');
    }

    // Check if user is active (only if isActive field exists)
    if (user.isActive !== undefined && !user.isActive) {
      throw new ForbiddenError('Account is deactivated.');
    }

    // Check if user is blocked (only if isBlocked field exists)
    if (user.isBlocked !== undefined && user.isBlocked) {
      throw new ForbiddenError('Account is blocked.');
    }

    // Check if account is locked (only if method exists)
    if (typeof user.isAccountLocked === 'function' && user.isAccountLocked()) {
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

// Musician-scoped access middleware
export const requireMusicianAccess = (req, res, next) => {
  try {

    if (!req.user) {
      throw new UnauthorizedError('Authentication required.');
    }

    // Get musicianId from params, body, or query
    const musicianId = req.user.musicianId;

    if (!musicianId) {
      throw new ForbiddenError('Musician ID is required to access this resource.');
    }

    // Double-check req.user exists before accessing musicianId
    if (!req.user) {
      throw new UnauthorizedError('User session expired.');
    }

    // Check if user has musicianId property
    if (!req.user.musicianId) {
      throw new ForbiddenError('User is not associated with any musician.');
    }

    // Check if user's musicianId matches the requested musicianId
    if (req.user.musicianId !== parseInt(musicianId)) {
      throw new ForbiddenError('Access denied. You can only access content for your assigned musician.');
    }

    // Add musicianId to request for use in controllers
    req.musicianId = parseInt(musicianId);
    next();
  } catch (error) {
    console.error("Error in requireMusicianAccess:", error);
    next(error);
  }
};

// Optional musician access middleware (doesn't throw error if musicianId doesn't match)
export const optionalMusicianAccess = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const musicianId = req.params.musicianId || req.body.musicianId || req.query.musicianId;

  if (musicianId && req.user.musicianId === parseInt(musicianId)) {
    req.musicianId = parseInt(musicianId);
  }

  next();
};

// Musician-scoped authentication middleware (combines auth + musician access)
export const authenticateMusician = async (req, res, next) => {
  try {
    // First authenticate the user
    await new Promise((resolve, reject) => {
      authenticate(req, res, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    // Ensure user is properly set before checking musician access
    if (!req.user) {
      throw new UnauthorizedError('Authentication failed.');
    }
    // Then check musician access
    requireMusicianAccess(req, res, next);

  } catch (error) {
    console.error("authenticateMusician - Error:", error);
    next(error);
  }
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
      musicianId: req.user?.musicianId || 'none',
      timestamp: new Date().toISOString()
    };
  });

  next();
};
