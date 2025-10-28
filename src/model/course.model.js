import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    musicianId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Musician'
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    courseType: {
      type: Number,
      enum: [1, 2], // 1 = paid, 2 = free
      required: true
    },
    price: {
      type: Number,
      required: function () {
        return this.courseType === 1; // Required only for paid courses
      },
      min: 0,
      default: 0
    },
    benefits: [{
      type: String,
      trim: true,
      maxlength: 500
    }],
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String, // e.g., "2 hours", "4 weeks"
      trim: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    enrollmentCount: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    courseContent: [{
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      videoUrl: {
        type: String,
        trim: true
      },
      duration: {
        type: String,
        trim: true
      },
      order: {
        type: Number,
        default: 0
      },
      isPreview: {
        type: Boolean,
        default: false
      }
    }],
    prerequisites: [{
      type: String,
      trim: true
    }],
    learningOutcomes: [{
      type: String,
      trim: true,
      maxlength: 300
    }]
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
courseSchema.index({ musicianId: 1 });
courseSchema.index({ title: 1 });
courseSchema.index({ description: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ courseType: 1 });
courseSchema.index({ isActive: 1 });
courseSchema.index({ createdAt: -1 });

// Virtual for course type name
courseSchema.virtual('courseTypeName').get(function () {
  return this.courseType === 1 ? 'paid' : 'free';
});

// Method to get similar courses
courseSchema.methods.getSimilarCourses = async function (limit = 5) {
  const Course = mongoose.model('Course');

  return await Course.find({
    _id: { $ne: this._id },
    category: this.category,
    isActive: true
  })
    .limit(limit)
    .sort({ enrollmentCount: -1, rating: -1 });
};

// Static method to get courses with pagination and search - Unified filtering
courseSchema.statics.getCoursesWithPagination = async function (options = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    courseType = null,
    category = null,
    level = null,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    minPrice = null,
    maxPrice = null,
    tags = null,
    isActive = null,
    musicianId = null
  } = options;

  const query = {};

  // Filter by musicianId if provided
  if (musicianId !== null) {
    query.musicianId = musicianId;
  }

  // Filter by active status (default to true if not specified)
  if (isActive !== null) {
    query.isActive = isActive;
  } else {
    query.isActive = true;
  }

  // Search functionality with regex
  if (search) {
    const searchRegex = new RegExp(search, 'i'); // case-insensitive regex
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { category: searchRegex },
      { tags: { $in: [searchRegex] } }
    ];
  }

  // Filter by course type
  if (courseType !== null) {
    query.courseType = courseType;
  }

  // Filter by category
  if (category) {
    query.category = new RegExp(category, 'i');
  }

  // Filter by level
  if (level) {
    query.level = level;
  }

  // Filter by price range
  if (minPrice !== null || maxPrice !== null) {
    query.price = {};
    if (minPrice !== null) {
      query.price.$gte = minPrice;
    }
    if (maxPrice !== null) {
      query.price.$lte = maxPrice;
    }
  }

  // Filter by tags
  if (tags && tags.length > 0) {
    query.tags = { $in: tags };
  }

  const skip = (page - 1) * limit;
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const courses = await this.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await this.countDocuments(query);

  return {
    courses,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalCourses: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }
  };
};

export const Course = mongoose.model("Course", courseSchema);
