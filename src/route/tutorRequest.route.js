import express from 'express';
import { 
  requestTutor,
  checkTutorRequestStatus
} from '../controller/tutorRequest.controller.js';
import { validateBody, validateQuery } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import { 
  requestTutorSchema,
  checkTutorRequestStatusSchema
} from '../validation/index.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Request tutor
router.post('/request', validateBody(requestTutorSchema), requestTutor);

// Check tutor request status
router.get('/check-status', validateQuery(checkTutorRequestStatusSchema), checkTutorRequestStatus);

export default router;

