import { Enrollment } from '../model/enrollment.model.js';
import { Course } from '../model/course.model.js';
import { User } from '../model/user.model.js';
import { CustomError } from '../utils/customError.js';
import moment from 'moment';

// Enroll in a course
export const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id; // Assuming user ID comes from auth middleware

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new CustomError('Course not found', 404);
    }

    // Check if course is active
    if (!course.isActive) {
      throw new CustomError('Course is not available for enrollment', 400);
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      isActive: true
    });

    if (existingEnrollment) {
      throw new CustomError('You are already enrolled in this course', 409);
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      user: userId,
      course: courseId,
      enrolledAt: new Date(),
      expiresAt: moment().add(3, 'months').toDate(),
      enrollmentType: course.courseType === 1 ? 'paid' : 'free',
      paymentDetails: {
        amount: course.courseType === 1 ? course.price : 0
      }
    });

    await enrollment.save();

    // Populate course details for response
    await enrollment.populate('course', 'title description thumbnail duration level category courseType price');

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        enrollment: {
          id: enrollment._id,
          course: enrollment.course,
          enrolledAt: enrollment.enrolledAt,
          expiresAt: enrollment.expiresAt,
          enrollmentType: enrollment.enrollmentType,
          daysRemaining: enrollment.daysRemaining,
          isExpired: enrollment.isExpired
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's enrolled courses
export const getMyCourses = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming user ID comes from auth middleware

    // Get user's active enrollments
    const enrollments = await Enrollment.getUserEnrollments(userId);

    // Format all courses in a single array
    const allCourses = enrollments.map(enrollment => ({
      enrollmentId: enrollment._id,
      enrolledAt: enrollment.enrolledAt,
      expiresAt: enrollment.expiresAt,
      daysRemaining: enrollment.daysRemaining,
      isExpired: enrollment.isExpired,
      enrollmentType: enrollment.enrollmentType,
      progress: enrollment.progress,
      course: enrollment.course
    }));

    res.status(200).json({
      success: true,
      message: 'My courses retrieved successfully',
      data: {
        courses: allCourses,
        totalEnrollments: enrollments.length,
        freeCount: enrollments.filter(e => e.enrollmentType === 'free').length,
        paidCount: enrollments.filter(e => e.enrollmentType === 'paid').length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get enrollment details for a specific course
export const getEnrollmentDetails = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      isActive: true
    }).populate('course', 'title description thumbnail duration level category courseType price courseContent');

    if (!enrollment) {
      throw new CustomError('Enrollment not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment details retrieved successfully',
      data: {
        enrollment: {
          id: enrollment._id,
          course: enrollment.course,
          enrolledAt: enrollment.enrolledAt,
          expiresAt: enrollment.expiresAt,
          enrollmentType: enrollment.enrollmentType,
          daysRemaining: enrollment.daysRemaining,
          isExpired: enrollment.isExpired,
          progress: enrollment.progress,
          paymentDetails: enrollment.paymentDetails
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update course progress
export const updateCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const { completedLessonId, completionPercentage } = req.body;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      isActive: true
    });

    if (!enrollment) {
      throw new CustomError('Enrollment not found', 404);
    }

    // Update progress
    if (completedLessonId && !enrollment.progress.completedLessons.includes(completedLessonId)) {
      enrollment.progress.completedLessons.push(completedLessonId);
    }

    if (completionPercentage !== undefined) {
      enrollment.progress.completionPercentage = Math.min(100, Math.max(0, completionPercentage));
    }

    enrollment.progress.lastAccessedAt = new Date();
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Course progress updated successfully',
      data: {
        progress: enrollment.progress
      }
    });
  } catch (error) {
    next(error);
  }
};

// Unenroll from a course (manual removal)
export const unenrollFromCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      isActive: true
    });

    if (!enrollment) {
      throw new CustomError('Enrollment not found', 404);
    }

    // Soft delete by setting isActive to false
    enrollment.isActive = false;
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    next(error);
  }
};

// Get enrollment statistics
export const getEnrollmentStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalEnrollments = await Enrollment.countDocuments({
      user: userId,
      isActive: true
    });

    const activeEnrollments = await Enrollment.countDocuments({
      user: userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    const expiredEnrollments = await Enrollment.countDocuments({
      user: userId,
      isActive: true,
      expiresAt: { $lte: new Date() }
    });

    const freeEnrollments = await Enrollment.countDocuments({
      user: userId,
      isActive: true,
      enrollmentType: 'free'
    });

    const paidEnrollments = await Enrollment.countDocuments({
      user: userId,
      isActive: true,
      enrollmentType: 'paid'
    });

    res.status(200).json({
      success: true,
      message: 'Enrollment statistics retrieved successfully',
      data: {
        totalEnrollments,
        activeEnrollments,
        expiredEnrollments,
        freeEnrollments,
        paidEnrollments
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin function to clean up expired enrollments
export const cleanupExpiredEnrollments = async (req, res, next) => {
  try {
    const removedCount = await Enrollment.removeExpiredEnrollments();

    res.status(200).json({
      success: true,
      message: `Cleaned up ${removedCount} expired enrollments`,
      data: {
        removedCount
      }
    });
  } catch (error) {
    next(error);
  }
};
