import express from 'express';
import { 
  enrollInCourse,
  getMyCourses,
  getEnrollmentDetails,
  updateCourseProgress,
  unenrollFromCourse,
  getEnrollmentStats,
  cleanupExpiredEnrollments
} from '../controller/enrollment.controller.js';
import { validateBody, validateParams } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import { enrollmentValidation } from '../validation/enrollment.validation.js';

const router = express.Router();

// All enrollment routes require authentication
router.use(authenticate);

// Enrollment management routes
router.post('/enroll/:courseId', validateParams(enrollmentValidation.courseId), enrollInCourse);
router.get('/my-courses', getMyCourses);
router.get('/course/:courseId', validateParams(enrollmentValidation.courseId), getEnrollmentDetails);
router.put('/course/:courseId/progress', validateParams(enrollmentValidation.courseId), validateBody(enrollmentValidation.updateProgress), updateCourseProgress);
router.delete('/unenroll/:courseId', validateParams(enrollmentValidation.courseId), unenrollFromCourse);
router.get('/stats', getEnrollmentStats);

// Admin route for cleanup (you might want to add admin middleware)
router.post('/admin/cleanup-expired', cleanupExpiredEnrollments);

export default router;
