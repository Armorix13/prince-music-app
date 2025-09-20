import express from 'express';
import { 
  addCourse,
  updateCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  getCourseCategories
} from '../controller/course.controller.js';
import { validateBody, validateQuery, validateParams } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import { courseValidation } from '../validation/course.validation.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', validateQuery(courseValidation.courseQuery), getAllCourses);
router.get('/categories', getCourseCategories);
router.get('/:courseId', validateParams(courseValidation.courseId), getCourseById);

// Protected routes (authentication required)
// router.use(authenticate);

// Course management routes
router.post('/', validateBody(courseValidation.createCourse), addCourse);
router.put('/:courseId', validateParams(courseValidation.courseId), validateBody(courseValidation.updateCourse), updateCourse);
router.delete('/:courseId', validateParams(courseValidation.courseId), deleteCourse);

export default router;