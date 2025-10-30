import express from 'express';
import { createFaq, createFaqsBulk, getFaqs } from '../controller/faq.controller.js';
import { validateBody, validateQuery } from '../middlewares/validation.js';
import { faqCreateSchema, faqBulkCreateSchema, faqListQuerySchema } from '../validation/faq.validation.js';

const router = express.Router();

// Create single FAQ
router.post('/', validateBody(faqCreateSchema), createFaq);

// Create bulk FAQs
router.post('/bulk', validateBody(faqBulkCreateSchema), createFaqsBulk);

// Get FAQs with pagination
router.get('/', validateQuery(faqListQuerySchema), getFaqs);

export default router;


