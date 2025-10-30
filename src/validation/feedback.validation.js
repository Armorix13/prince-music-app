import Joi from 'joi';

export const feedbackCreateSchema = Joi.object({
  musicianId: Joi.number().integer().min(1).required(),
  title: Joi.string().trim().min(3).max(200).required(),
  description: Joi.string().trim().min(3).max(5000).required(),
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().trim().email().required()
});

export const feedbackListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  musicianId: Joi.number().integer().min(1).optional()
});


