import express from 'express';
import Joi from 'joi';
import { 
  createOrUpdatePortfolio,
  addContentToSection,
  getPortfolio,
  getPortfolioByEmail,
  updateSectionContent,
  deleteSection,
  getPrinceSections
} from '../controller/portfolio.controller.js';
import { validateBody } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Validation schemas
const portfolioSchema = Joi.object({
  coverPhoto: Joi.string().uri().required(),
  profilePhoto: Joi.string().uri().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  mail: Joi.string().email().required(),
  contact: Joi.string().required(),
  location: Joi.string().required(),
  socialMedia: Joi.array().items(
    Joi.object({
      iconUrl: Joi.string().uri().required(),
      link: Joi.string().required()
    })
  ).required()
});

const addContentSchema = Joi.object({
  sectionTitle: Joi.string().required(),
  content: Joi.object({
    title: Joi.string().required(),
    url: Joi.string().uri().required(),
    description: Joi.string().optional(),
    thumbnail: Joi.string().uri().optional(),
    duration: Joi.string().optional()
  }).required()
});

const updateContentSchema = Joi.object({
  content: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      url: Joi.string().uri().required(),
      description: Joi.string().optional(),
      thumbnail: Joi.string().uri().optional(),
      duration: Joi.string().optional()
    })
  ).required()
});

// Public routes (no authentication required)
router.post('/add-update-portfolio', validateBody(portfolioSchema), createOrUpdatePortfolio);
router.get('/portfolio/email/:email', getPortfolioByEmail);

// Protected routes (authentication required)
// router.use(authenticate);

// Portfolio management routes
router.get('/:princeId', getPortfolio);
router.post('/:princeId/section/content', validateBody(addContentSchema), addContentToSection);
router.put('/:princeId/section/:sectionTitle/content', validateBody(updateContentSchema), updateSectionContent);
router.delete('/:princeId/section/:sectionTitle', deleteSection);
router.get('/:princeId/sections', getPrinceSections);

export default router;
