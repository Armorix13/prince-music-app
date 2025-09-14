import Joi from 'joi';

// User signup validation schema
export const userSignupSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes',
      'any.required': 'First name is required'
    }),
  
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes',
      'any.required': 'Last name is required'
    }),
  
  countryCode: Joi.string()
    .valid('+1', '+44', '+91', '+86', '+33', '+49', '+81', '+61', '+55', '+7')
    .required()
    .messages({
      'any.only': 'Invalid country code',
      'any.required': 'Country code is required'
    }),
  
  phoneNumber: Joi.string()
    .pattern(/^\d{7,15}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be 7-15 digits',
      'any.required': 'Phone number is required'
    }),
  
  dob: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'Date of birth must be a valid date',
      'date.max': 'Date of birth cannot be in the future',
      'any.required': 'Date of birth is required'
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .max(254)
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email is too long',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    }),
  
  deviceType: Joi.string()
    .valid('android', 'ios', 'web')
    .required()
    .messages({
      'any.only': 'Device type must be one of: android, ios, web',
      'any.required': 'Device type is required'
    }),
  
  deviceToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'Device token is required',
      'any.required': 'Device token is required'
    }),
  
  socialType: Joi.string()
    .valid('google', 'facebook', 'apple', 'normal')
    .default('normal')
    .optional()
    .messages({
      'any.only': 'Social type must be one of: google, facebook, apple, normal'
    }),
  
  socialId: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Social ID cannot be empty'
    }),
  
  profileImage: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Profile image must be a valid URL'
    }),
  
  theme: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Theme cannot be empty'
    })
});
export const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    }),
  
  deviceType: Joi.string()
    .valid('android', 'ios', 'web')
    .required()
    .messages({
      'any.only': 'Device type must be one of: android, ios, web',
      'any.required': 'Device type is required'
    }),
  
  deviceToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'Device token is required',
      'any.required': 'Device token is required'
    })
});

// User profile update validation schema
export const userUpdateSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes'
    }),
  
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes'
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .max(254)
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email is too long'
    }),
  
  countryCode: Joi.string()
    .valid('+1', '+44', '+91', '+86', '+33', '+49', '+81', '+61', '+55', '+7')
    .optional()
    .messages({
      'any.only': 'Invalid country code'
    }),
  
  phoneNumber: Joi.string()
    .pattern(/^\d{7,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be 7-15 digits'
    }),
  
  dob: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.base': 'Date of birth must be a valid date',
      'date.max': 'Date of birth cannot be in the future'
    }),
  
  profileImage: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Profile image must be a valid URL'
    }),
  
  theme: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Theme cannot be empty'
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
