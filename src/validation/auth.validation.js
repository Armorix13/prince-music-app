import Joi from 'joi';

// Social login validation schema
export const socialLoginSchema = Joi.object({
  socialType: Joi.string()
    .valid('google', 'facebook', 'apple')
    .required()
    .messages({
      'any.only': 'Social type must be one of: google, facebook, apple',
      'any.required': 'Social type is required'
    }),
  
  socialId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Social ID is required',
      'any.required': 'Social ID is required'
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters'
    }),
  
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  
  profileImage: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Profile image must be a valid URL'
    }),
  
  deviceType: Joi.string()
    .valid('android', 'ios', 'web')
    .optional()
    .messages({
      'any.only': 'Device type must be one of: android, ios, web'
    }),
  
  deviceToken: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Device token cannot be empty'
    })
});

// Refresh token validation schema
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'Refresh token is required',
      'any.required': 'Refresh token is required'
    })
});

// Device info validation schema
export const deviceInfoSchema = Joi.object({
  userAgent: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'User agent is too long'
    }),
  
  ip: Joi.string()
    .ip()
    .optional()
    .messages({
      'string.ip': 'Invalid IP address'
    })
});
