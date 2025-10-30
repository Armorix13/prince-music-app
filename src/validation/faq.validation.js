import Joi from 'joi';

export const faqCreateSchema = Joi.object({
  question: Joi.string().trim().min(3).max(500).required(),
  answer: Joi.string().trim().min(1).max(5000).required(),
  isActive: Joi.boolean().optional()
});

export const faqBulkCreateSchema = Joi.object({
  faqs: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().trim().min(3).max(500).required(),
        answer: Joi.string().trim().min(1).max(5000).required(),
        isActive: Joi.boolean().optional()
      })
    )
    .min(1)
    .required()
});

export const faqListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  isActive: Joi.string().valid('true', 'false').optional()
});


