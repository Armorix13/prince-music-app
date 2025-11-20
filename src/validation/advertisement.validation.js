import Joi from 'joi';

export const advertisementCreateSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),
  description: Joi.string().trim().min(3).max(5000).required(),
  photoUrl: Joi.string().trim().uri().optional().allow(null, '')
});

export const advertisementListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

