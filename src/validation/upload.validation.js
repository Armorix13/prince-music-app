import Joi from 'joi';

// File upload validation schema
export const fileUploadSchema = Joi.object({
  fieldName: Joi.string()
    .valid('profileImage', 'coverPhoto', 'audio', 'video', 'document', 'file')
    .required()
    .messages({
      'any.only': 'Invalid field name. Allowed: profileImage, coverPhoto, audio, video, document, file',
      'any.required': 'Field name is required'
    })
});

// Multiple files upload validation schema
export const multipleFilesUploadSchema = Joi.object({
  fieldName: Joi.string()
    .valid('files', 'audio', 'video', 'documents')
    .required()
    .messages({
      'any.only': 'Invalid field name. Allowed: files, audio, video, documents',
      'any.required': 'Field name is required'
    }),
  maxCount: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .optional()
    .messages({
      'number.base': 'Max count must be a number',
      'number.integer': 'Max count must be an integer',
      'number.min': 'Max count must be at least 1',
      'number.max': 'Max count cannot exceed 10'
    })
});

// File deletion validation schema
export const fileDeletionSchema = Joi.object({
  filename: Joi.string()
    .required()
    .messages({
      'string.empty': 'Filename is required',
      'any.required': 'Filename is required'
    })
});

// File info validation schema
export const fileInfoSchema = Joi.object({
  filename: Joi.string()
    .required()
    .messages({
      'string.empty': 'Filename is required',
      'any.required': 'Filename is required'
    })
});

// File serving validation schema
export const fileServingSchema = Joi.object({
  filename: Joi.string()
    .required()
    .messages({
      'string.empty': 'Filename is required',
      'any.required': 'Filename is required'
    })
});

// File listing query validation schema
export const fileListingSchema = Joi.object({
  directory: Joi.string()
    .optional()
    .messages({
      'string.base': 'Directory must be a string'
    }),
  type: Joi.string()
    .valid('image', 'audio', 'video', 'document', 'all')
    .optional()
    .messages({
      'any.only': 'Type must be one of: image, audio, video, document, all'
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    })
});
