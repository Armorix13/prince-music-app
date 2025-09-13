import Joi from 'joi';

// Generic ID validation schema
export const idSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid ID format',
      'any.required': 'ID is required'
    })
});

// Pagination validation schema
export const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  
  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'firstName', 'lastName', 'email')
    .default('createdAt')
    .messages({
      'any.only': 'Invalid sort field'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be asc or desc'
    })
});

// Search validation schema
export const searchSchema = Joi.object({
  query: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Search query is required',
      'string.min': 'Search query must be at least 1 character',
      'string.max': 'Search query cannot exceed 100 characters',
      'any.required': 'Search query is required'
    }),
  
  type: Joi.string()
    .valid('user', 'email', 'phone', 'all')
    .default('all')
    .messages({
      'any.only': 'Search type must be user, email, phone, or all'
    })
});

// File upload validation schema
export const fileUploadSchema = Joi.object({
  fieldname: Joi.string()
    .required()
    .messages({
      'any.required': 'Field name is required'
    }),
  
  originalname: Joi.string()
    .required()
    .messages({
      'any.required': 'Original filename is required'
    }),
  
  mimetype: Joi.string()
    .valid('image/jpeg', 'image/png', 'image/gif', 'image/webp')
    .required()
    .messages({
      'any.only': 'File must be an image (JPEG, PNG, GIF, or WebP)',
      'any.required': 'File type is required'
    }),
  
  size: Joi.number()
    .max(5 * 1024 * 1024) // 5MB
    .required()
    .messages({
      'number.max': 'File size cannot exceed 5MB',
      'any.required': 'File size is required'
    })
});

// Common validation schemas
export const commonSchemas = {
  idSchema,
  paginationSchema,
  searchSchema,
  fileUploadSchema
};
