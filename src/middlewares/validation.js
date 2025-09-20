import Joi from 'joi';
import { ValidationError } from '../utils/customError.js';

// Generic validation middleware using Joi
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body, query, and params
      const { error, value } = schema.validate({
        body: req.body,
        query: req.query,
        params: req.params
      }, {
        abortEarly: false, // Show all validation errors
        stripUnknown: true, // Remove unknown fields
        allowUnknown: false // Don't allow unknown fields
      });

      if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ValidationError(errorMessages);
      }

      // Replace req properties with validated and sanitized values
      req.body = value.body || req.body;
      req.query = value.query || req.query;
      req.params = value.params || req.params;

      next();
    } catch (err) {
      next(err);
    }
  };
};

// Validation middleware for request body only
export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false
      });

      if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ValidationError(errorMessages);
      }

      req.body = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

// Validation middleware for query parameters only
export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false
      });

      if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ValidationError(errorMessages);
      }

      // Store validated query parameters in a custom property
      req.validatedQuery = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

// Validation middleware for URL parameters only
export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false
      });

      if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ValidationError(errorMessages);
      }

      req.params = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

// Custom validation for file uploads
export const validateFile = (options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    required = false
  } = options;

  return (req, res, next) => {
    try {
      const file = req.file;

      if (required && !file) {
        throw new ValidationError('File is required');
      }

      if (file) {
        // Check file size
        if (file.size > maxSize) {
          throw new ValidationError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        }

        // Check file type
        if (!allowedTypes.includes(file.mimetype)) {
          throw new ValidationError(`File type must be one of: ${allowedTypes.join(', ')}`);
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
