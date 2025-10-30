import express from 'express';
import { createFeedback, listFeedback } from '../controller/feedback.controller.js';
import { validateBody, validateQuery } from '../middlewares/validation.js';
import { feedbackCreateSchema, feedbackListQuerySchema } from '../validation/feedback.validation.js';

const router = express.Router();

// Public endpoints to submit and view feedback (paginated)
router.post('/', validateBody(feedbackCreateSchema), createFeedback);
router.get('/', validateQuery(feedbackListQuerySchema), listFeedback);

export default router;


