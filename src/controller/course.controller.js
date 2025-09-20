import { Course } from '../model/course.model.js';
import { CustomError } from '../utils/customError.js';

// Add new course
export const addCourse = async (req, res, next) => {
  try {
    const courseData = req.body;

    // Create new course
    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    next(error);
  }
};

// Update course
export const updateCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const updateData = req.body;

    // Check if course exists
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      throw new CustomError('Course not found', 404);
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
};

// Get all courses with pagination, search, and filters - Unified API with separate paid/free
export const getAllCourses = async (req, res, next) => {
  try {
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

    // Get paginated courses
    const allCoursesResult = await Course.getCoursesWithPagination(options);

    // Get all paid courses (without pagination and without search)
    const paidCoursesOptions = {
      ...options,
      courseType: 1, // paid courses
      search: '', // Remove search for paid courses
      page: 1,
      limit: 1000 // large limit to get all
    };
    const paidCoursesResult = await Course.getCoursesWithPagination(paidCoursesOptions);

    // Get all free courses (without pagination and without search)
    const freeCoursesOptions = {
      ...options,
      courseType: 2, // free courses
      search: '', // Remove search for free courses
      page: 1,
      limit: 1000 // large limit to get all
    };
    const freeCoursesResult = await Course.getCoursesWithPagination(freeCoursesOptions);

    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: {
        allCourses: allCoursesResult, // Contains pagination info
        paidCourses: paidCoursesResult.courses, // All paid courses without pagination
        freeCourses: freeCoursesResult.courses // All free courses without pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get course by ID with similar courses
export const getCourseById = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      throw new CustomError('Course not found', 404);
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
};



// Delete course (soft delete)
export const deleteCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      throw new CustomError('Course not found', 404);
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
};

// Get course categories
export const getCourseCategories = async (req, res, next) => {
  try {
    const categories = await Course.distinct('category', { isActive: true });
    
    res.status(200).json({
      success: true,
      message: 'Course categories retrieved successfully',
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

