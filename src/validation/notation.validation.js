import Joi from 'joi';

export const notationCreateSchema = Joi.object({
  musicianId: Joi.number().integer().min(1).required(),
  songName: Joi.string().trim().min(1).max(200).required(),
  songReferenceUrl: Joi.string().uri().trim().allow('').optional(),
  videoUrl: Joi.string().uri().trim().allow('').optional(),
  audioUrl: Joi.string().uri().trim().allow('').optional()
});

export const notationListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  musicianId: Joi.number().integer().min(1).optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed', 'rejected').optional(),
  myNotations: Joi.string().valid('true', 'false').optional()
});

