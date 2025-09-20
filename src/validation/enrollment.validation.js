import Joi from 'joi';

// Enrollment validation schemas
export const enrollmentValidation = {
  // Schema for course ID parameter
  courseId: Joi.object({
    courseId: Joi.string().required().messages({
      'string.empty': 'Course ID is required'
    })
  }),

  // Schema for updating course progress
  updateProgress: Joi.object({
    completedLessonId: Joi.string().optional().messages({
      'string.empty': 'Lesson ID cannot be empty'
    }),
    completionPercentage: Joi.number().min(0).max(100).optional().messages({
      'number.min': 'Completion percentage cannot be less than 0',
      'number.max': 'Completion percentage cannot be more than 100'
    })
  }),

  // Schema for enrollment statistics (no body validation needed)
  enrollmentStats: Joi.object({}),

  // Schema for cleanup expired enrollments (no body validation needed)
  cleanupExpired: Joi.object({})
};
