import Joi from 'joi';

// Social media schema
const socialMediaSchema = Joi.object({
  iconUrl: Joi.string().uri().optional(),
  link: Joi.string().uri().optional()
});

// Create musician validation
export const createMusicianSchema = Joi.object({
  body: Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .max(254)
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.max': 'Email is too long',
      'any.required': 'Email is required'
    }),

  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name is too long',
      'any.required': 'First name is required'
    }),

  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name is too long',
      'any.required': 'Last name is required'
    }),

  password: Joi.string()
    .min(8)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password is too long'
    }),

  phoneNumber: Joi.string()
    .trim()
    .max(20)
    .required()
    .messages({
      'string.max': 'Phone number is too long',
      'any.required': 'Phone number is required'
    }),

  musicianName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Musician name must be at least 2 characters',
      'string.max': 'Musician name is too long',
      'any.required': 'Musician name is required'
    }),

  description: Joi.string()
    .trim()
    .max(2000)
    .optional()
    .messages({
      'string.max': 'Description is too long'
    }),

  mail: Joi.string()
    .email()
    .trim()
    .max(254)
    .optional()
    .messages({
      'string.email': 'Mail must be a valid email address',
      'string.max': 'Mail is too long'
    }),

  contact: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Contact is too long'
    }),

  location: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Location is too long'
    }),

  socialMedia: Joi.array()
    .items(socialMediaSchema)
    .optional()
  }).required(),
  query: Joi.object({}).optional(),
  params: Joi.object({}).optional()
});

// Musician login validation
export const musicianLoginSchema = Joi.object({
  body: Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .max(254)
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.max': 'Email is too long',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    }),

  deviceType: Joi.string()
    .valid('android', 'ios', 'web')
    .optional()
    .messages({
      'any.only': 'Device type must be one of: android, ios, web'
    }),

  deviceToken: Joi.string()
    .optional()
  }).required(),
  query: Joi.object({}).optional(),
  params: Joi.object({}).optional()
});

// Update musician profile validation
export const updateMusicianProfileSchema = Joi.object({
  body: Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name is too long'
    }),

  description: Joi.string()
    .trim()
    .max(2000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description is too long'
    }),

  mail: Joi.string()
    .email()
    .trim()
    .max(254)
    .optional()
    .messages({
      'string.email': 'Mail must be a valid email address',
      'string.max': 'Mail is too long'
    }),

  contact: Joi.string()
    .trim()
    .max(50)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Contact is too long'
    }),

  location: Joi.string()
    .trim()
    .max(200)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Location is too long'
    }),

  coverPhoto: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Cover photo must be a valid URL'
    }),

  profilePhoto: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Profile photo must be a valid URL'
    }),

  socialMedia: Joi.array()
    .items(socialMediaSchema)
    .optional()
  }).optional(),
  query: Joi.object({}).optional(),
  params: Joi.object({}).optional()
});

