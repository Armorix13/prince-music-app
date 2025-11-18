import { Course } from '../model/course.model.js';
import { Musician } from '../model/musician.model.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/customError.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { Enrollment } from '../model/enrollment.model.js';

// Add new course
export const addCourse = asyncHandler(async (req, res, next) => {
  try {
    // Find musician by musicianId
    const musician = await Musician.findOne({ 
      musicianId: req.user.musicianId,
      isActive: true 
    });
    
    if (!musician) {
      throw new NotFoundError('Musician not found or inactive');
    }

    // Validate price for paid courses
    if (req.body.courseType === 1 && (!req.body.price || req.body.price <= 0)) {
      throw new ValidationError('Price is required and must be greater than 0 for paid courses');
    }

    // Set price to 0 for free courses
    if (req.body.courseType === 2) {
      req.body.price = 0;
    }

    const courseData = {
      ...req.body,
      musicianId: musician._id // Use musician ObjectId
    };

    // Create new course
    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    next(error);
  }
});

// Update course
export const updateCourse = asyncHandler(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const updateData = req.body;

    // Find musician by musicianId
    const musician = await Musician.findOne({ 
      musicianId: req.user.musicianId,
      isActive: true 
    });
    
    if (!musician) {
      throw new NotFoundError('Musician not found or inactive');
    }

    // Check if course exists and belongs to the musician
    const existingCourse = await Course.findOne({ 
      _id: courseId, 
      musicianId: musician._id 
    });
    
    if (!existingCourse) {
      throw new NotFoundError('Course not found or access denied');
    }

    // Validate price for paid courses
    if (updateData.courseType === 1 && updateData.price !== undefined && updateData.price <= 0) {
      throw new ValidationError('Price must be greater than 0 for paid courses');
    }

    // Set price to 0 for free courses if courseType is being changed to free
    if (updateData.courseType === 2) {
      updateData.price = 0;
    }

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: { course: updatedCourse }
    });
  } catch (error) {
    next(error);
  }
});

// Get all courses with pagination, search, and filters - Unified API with separate paid/free
export const getAllCourses = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.user?.id);
    // Use validatedQuery if available, otherwise fall back to req.query
    const queryParams = req.validatedQuery || req.query;
    
    const {
      page = 1,
      limit = 10,
      search = '',
      courseType,
      category,
      level,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      tags,
      isActive
    } = queryParams;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      courseType: courseType ? parseInt(courseType) : null,
      category,
      level,
      sortBy,
      sortOrder,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : null,
      isActive: isActive !== undefined ? isActive === 'true' : null
    };

    // If user is authenticated, get user's active enrollments first so we can remove those courses
    let myCourses = [];
    let enrolledCourseIds = new Set();

    if (req.user && req.user.id) {
      const userId = req.user.id;
      const enrollments = await Enrollment.getUserEnrollments(userId);

      // Build myCourses array and set of enrolled course ids
      myCourses = enrollments.map(enrollment => {
        // enrollment.course should be populated by getUserEnrollments
        const courseDoc = enrollment.course;
        const courseId = courseDoc ? courseDoc._id.toString() : enrollment.course.toString();
        enrolledCourseIds.add(courseId);

        return {
          enrollmentId: enrollment._id,
          enrolledAt: enrollment.enrolledAt,
          expiresAt: enrollment.expiresAt,
          daysRemaining: enrollment.daysRemaining,
          isExpired: enrollment.isExpired,
          enrollmentType: enrollment.enrollmentType,
          progress: enrollment.progress,
          course: courseDoc
        };
      });
    }

    // Get paginated courses (all courses list)
    const allCoursesResult = await Course.getCoursesWithPagination(options);

    // Prepare paid and free course options (without search)
    const paidCoursesOptions = {
      ...options,
      courseType: 1,
      search: '',
      page: 1,
      limit: 1000
    };
    const freeCoursesOptions = {
      ...options,
      courseType: 2,
      search: '',
      page: 1,
      limit: 1000
    };

    // Fetch paid & free courses
    const paidCoursesResult = await Course.getCoursesWithPagination(paidCoursesOptions);
    const freeCoursesResult = await Course.getCoursesWithPagination(freeCoursesOptions);

    // Remove any courses the user is enrolled in from paid/free arrays
    if (enrolledCourseIds.size > 0) {
      paidCoursesResult.courses = paidCoursesResult.courses.filter(c => !enrolledCourseIds.has(c._id.toString()));
      freeCoursesResult.courses = freeCoursesResult.courses.filter(c => !enrolledCourseIds.has(c._id.toString()));
    }

    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: {
        allCourses: allCoursesResult, // Contains pagination info
        paidCourses: paidCoursesResult.courses, // All paid courses (enrolled removed)
        freeCourses: freeCoursesResult.courses, // All free courses (enrolled removed)
        myCourses: myCourses // User's enrolled courses (empty if not authenticated)
      }
    });
  } catch (error) {
    next(error);
  }
});


// Get course by ID with similar courses
export const getCourseById = asyncHandler(async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Get similar courses
    const similarCourses = await course.getSimilarCourses(6);

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: {
        course,
        similarCourses
      }
    });
  } catch (error) {
    next(error);
  }
});



// Delete course (soft delete)
export const deleteCourse = asyncHandler(async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // Find musician by musicianId
    const musician = await Musician.findOne({ 
      musicianId: req.user.musicianId,
      isActive: true 
    });
    
    if (!musician) {
      throw new NotFoundError('Musician not found or inactive');
    }

    // Check if course exists and belongs to the musician
    const course = await Course.findOne({ 
      _id: courseId, 
      musicianId: musician._id 
    });
    
    if (!course) {
      throw new NotFoundError('Course not found or access denied');
    }

    // Soft delete by setting isActive to false
    course.isActive = false;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get course categories
export const getCourseCategories = asyncHandler(async (req, res, next) => {
  try {
    // If user is authenticated and is a musician, get their categories
    let query = { isActive: true };
    
    if (req.user && req.user.role === 'musician' && req.user.musicianId) {
      const musician = await Musician.findOne({ 
        musicianId: req.user.musicianId,
        isActive: true 
      });
      
      if (musician) {
        query.musicianId = musician._id;
      }
    }
    
    const categories = await Course.distinct('category', query);
    
    res.status(200).json({
      success: true,
      message: 'Course categories retrieved successfully',
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
});

