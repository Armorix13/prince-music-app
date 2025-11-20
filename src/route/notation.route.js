import express from 'express';
import { addNotation, getAllNotation } from '../controller/notation.controller.js';
import { validateBody, validateQuery } from '../middlewares/validation.js';
import { notationCreateSchema, notationListQuerySchema } from '../validation/notation.validation.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Add notation request (can be public or authenticated)
router.post('/', validateBody(notationCreateSchema),authenticate, addNotation);

// Get all notation requests (filtered by musicianId)
router.get('/', validateQuery(notationListQuerySchema),authenticate, getAllNotation);

export default router;

