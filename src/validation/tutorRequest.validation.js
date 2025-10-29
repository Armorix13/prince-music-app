import Joi from 'joi';

// Request tutor validation schema
export const requestTutorSchema = Joi.object({
  musicianId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Musician ID must be a number',
      'number.integer': 'Musician ID must be an integer',
      'number.positive': 'Musician ID must be a positive number',
      'any.required': 'Musician ID is required'
    }),
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
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
  topic: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Topic is required',
      'string.min': 'Topic must be at least 3 characters long',
      'string.max': 'Topic cannot exceed 200 characters',
      'any.required': 'Topic is required'
    }),
  message: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Message is required',
      'string.min': 'Message must be at least 10 characters long',
      'string.max': 'Message cannot exceed 1000 characters',
      'any.required': 'Message is required'
    })
});

// Check tutor request status validation schema (for query params)
export const checkTutorRequestStatusSchema = Joi.object({
  musicianId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Musician ID must be a number',
      'number.integer': 'Musician ID must be an integer',
      'number.positive': 'Musician ID must be a positive number',
      'any.required': 'Musician ID is required'
    })
});

