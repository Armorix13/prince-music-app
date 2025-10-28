import express from 'express';
import Joi from 'joi';
import {
  createOrUpdatePortfolio,
  addContentToSection,
  getPortfolio,
  getPortfolioByEmail,
  updateSectionContent,
  deleteSection,
  getMusicianSections
} from '../controller/portfolio.controller.js';
import { validateBody } from '../middlewares/validation.js';
import { authenticate, authenticateMusician, requireMusicianAccess } from '../middlewares/auth.js';

const router = express.Router();

// Validation schemas
const portfolioSchema = Joi.object({
  musicianId: Joi.number().integer().positive().optional(),
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
  musicianId: Joi.number().integer().positive().required(),
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

router.use(authenticateMusician);

// Public routes (no authentication required)
router.get('/portfolio/email/:email', getPortfolioByEmail);

// Protected routes (musician-scoped authentication required)

// Portfolio management routes
router.post('/add-update-portfolio', validateBody(portfolioSchema), createOrUpdatePortfolio);


router.get('/:musicianId', getPortfolio);
router.post('/section/content', validateBody(addContentSchema), addContentToSection);
router.put('/:musicianId/section/:sectionTitle/content', validateBody(updateContentSchema), updateSectionContent);
router.delete('/:musicianId/section/:sectionTitle', deleteSection);
router.get('/:musicianId/sections', getMusicianSections);

export default router;
