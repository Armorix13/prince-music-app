import Joi from 'joi';

// Course validation schemas
export const courseValidation = {
  // Schema for creating a new course
  createCourse: Joi.object({
    title: Joi.string().required().trim().max(200).messages({
      'string.empty': 'Course title is required',
      'string.max': 'Course title cannot exceed 200 characters'
    }),
    description: Joi.string().required().trim().max(2000).messages({
      'string.empty': 'Course description is required',
      'string.max': 'Course description cannot exceed 2000 characters'
    }),
    courseType: Joi.number().valid(1, 2).required().messages({
      'any.only': 'Course type must be 1 (paid) or 2 (free)',
      'any.required': 'Course type is required'
    }),
    price: Joi.number().min(0).when('courseType', {
      is: 1,
      then: Joi.required().messages({
        'any.required': 'Price is required for paid courses'
      }),
      otherwise: Joi.optional()
    }).messages({
      'number.min': 'Price cannot be negative'
    }),
    benefits: Joi.array().items(
      Joi.string().trim().max(500)
    ).optional().messages({
      'array.base': 'Benefits must be an array'
    }),
    category: Joi.string().required().trim().max(100).messages({
      'string.empty': 'Course category is required',
      'string.max': 'Course category cannot exceed 100 characters'
    }),
    thumbnail: Joi.string().required().trim().messages({
      'string.empty': 'Course thumbnail is required'
    }),
    duration: Joi.string().trim().optional(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner').messages({
      'any.only': 'Level must be beginner, intermediate, or advanced'
    }),
    tags: Joi.array().items(
      Joi.string().trim().lowercase()
    ).optional(),
    courseContent: Joi.array().items(
      Joi.object({
        title: Joi.string().required().trim().messages({
          'string.empty': 'Content title is required'
        }),
        description: Joi.string().trim().optional(),
        videoUrl: Joi.string().trim().optional(),
        duration: Joi.string().trim().optional(),
        order: Joi.number().default(0),
        isPreview: Joi.boolean().default(false)
      })
    ).optional(),
    prerequisites: Joi.array().items(
      Joi.string().trim()
    ).optional(),
    learningOutcomes: Joi.array().items(
      Joi.string().trim().max(300)
    ).optional()
  }),

  // Schema for updating a course
  updateCourse: Joi.object({
    title: Joi.string().trim().max(200).optional().messages({
      'string.max': 'Course title cannot exceed 200 characters'
    }),
    description: Joi.string().trim().max(2000).optional().messages({
      'string.max': 'Course description cannot exceed 2000 characters'
    }),
    courseType: Joi.number().valid(1, 2).optional().messages({
      'any.only': 'Course type must be 1 (paid) or 2 (free)'
    }),
    price: Joi.number().min(0).optional().messages({
      'number.min': 'Price cannot be negative'
    }),
    benefits: Joi.array().items(
      Joi.string().trim().max(500)
    ).optional(),
    category: Joi.string().trim().max(100).optional().messages({
      'string.max': 'Course category cannot exceed 100 characters'
    }),
    thumbnail: Joi.string().trim().optional(),
    instructor: Joi.string().optional(),
    duration: Joi.string().trim().optional(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced').optional().messages({
      'any.only': 'Level must be beginner, intermediate, or advanced'
    }),
    tags: Joi.array().items(
      Joi.string().trim().lowercase()
    ).optional(),
    courseContent: Joi.array().items(
      Joi.object({
        title: Joi.string().required().trim(),
        description: Joi.string().trim().optional(),
        videoUrl: Joi.string().trim().optional(),
        duration: Joi.string().trim().optional(),
        order: Joi.number().default(0),
        isPreview: Joi.boolean().default(false)
      })
    ).optional(),
    prerequisites: Joi.array().items(
      Joi.string().trim()
    ).optional(),
    learningOutcomes: Joi.array().items(
      Joi.string().trim().max(300)
    ).optional()
  }),

  // Schema for query parameters - Unified API with all filtering options
  courseQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().optional(),
    courseType: Joi.number().valid(1, 2).optional(),
    category: Joi.string().trim().optional(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
    sortBy: Joi.string().valid('createdAt', 'title', 'price', 'enrollmentCount', 'rating').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    // Additional filtering options
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    tags: Joi.string().trim().optional(), // comma-separated tags
    isActive: Joi.boolean().optional()
  }),

  // Schema for course ID parameter
  courseId: Joi.object({
    courseId: Joi.string().required().messages({
      'string.empty': 'Course ID is required'
    })
  }),

};
