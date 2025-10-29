import express from 'express';
import {
  createMusician,
  musicianLogin,
  getMusicianProfile,
  updateMusicianProfile,
  getAllMusicians,
  deleteMusician
} from '../controller/musician.controller.js';
import { authenticate, requireAdmin, requireMusician } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import {
  createMusicianSchema,
  musicianLoginSchema,
  updateMusicianProfileSchema
} from '../validation/musician.validation.js';

const router = express.Router();

// Public routes
router.post('/login', validate(musicianLoginSchema), musicianLogin);

// Protected routes - Require musician authentication
router.get('/profile', authenticate, requireMusician, getMusicianProfile);
router.put('/profile', authenticate, requireMusician, validate(updateMusicianProfileSchema), updateMusicianProfile);

// Admin only routes
router.post('/create',/* authenticate,  requireAdmin, */ validate(createMusicianSchema), createMusician);
router.get('/all', authenticate, requireAdmin, getAllMusicians);
router.delete('/:musicianId', authenticate, requireAdmin, deleteMusician);

export default router;

