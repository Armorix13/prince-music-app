import express from 'express';
import {
  createAdvertisement,
  getAdvertisements
} from '../controller/advertisement.controller.js';
import { validateBody, validateQuery } from '../middlewares/validation.js';
import {
  advertisementCreateSchema,
  advertisementListQuerySchema
} from '../validation/advertisement.validation.js';

const router = express.Router();

router.post('/', validateBody(advertisementCreateSchema), createAdvertisement);
router.get('/', validateQuery(advertisementListQuerySchema), getAdvertisements);

export default router;

