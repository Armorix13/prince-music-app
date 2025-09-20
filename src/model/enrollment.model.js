import mongoose from "mongoose";
import moment from "moment";

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: function() {
        // Auto-expire after 3 months from enrollment
        return moment().add(3, 'months').toDate();
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    enrollmentType: {
      type: String,
      enum: ['free', 'paid'],
      required: true
    },
    // For paid courses, we can store payment details
    paymentDetails: {
      amount: {
        type: Number,
        default: 0
      },
      paymentMethod: {
        type: String,
        default: null
      },
      transactionId: {
        type: String,
        default: null
      },
      paymentDate: {
        type: Date,
        default: null
      }
    },
    // Track course progress
    progress: {
      completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseContent'
      }],
      lastAccessedAt: {
        type: Date,
        default: Date.now
      },
      completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      }
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
enrollmentSchema.index({ user: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ enrolledAt: -1 });
enrollmentSchema.index({ expiresAt: 1 });
enrollmentSchema.index({ isActive: 1 });
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true }); // Prevent duplicate enrollments

// Virtual for enrollment status
enrollmentSchema.virtual('isExpired').get(function() {
  return moment().isAfter(moment(this.expiresAt));
});

// Virtual for days remaining
enrollmentSchema.virtual('daysRemaining').get(function() {
  const now = moment();
  const expiry = moment(this.expiresAt);
  return Math.max(0, expiry.diff(now, 'days'));
});

// Method to check if enrollment is valid
enrollmentSchema.methods.isValid = function() {
  return this.isActive && !this.isExpired;
};

// Static method to get user's active enrollments
enrollmentSchema.statics.getUserEnrollments = async function(userId) {
  const now = moment();
  
  return await this.find({
    user: userId,
    isActive: true,
    expiresAt: { $gt: now.toDate() }
  })
  .populate('course', 'title description thumbnail duration level category courseType price')
  .sort({ enrolledAt: -1 });
};

// Static method to get expired enrollments for cleanup
enrollmentSchema.statics.getExpiredEnrollments = async function() {
  const now = moment();
  
  return await this.find({
    isActive: true,
    expiresAt: { $lte: now.toDate() }
  });
};

// Static method to automatically remove expired enrollments
enrollmentSchema.statics.removeExpiredEnrollments = async function() {
  const expiredEnrollments = await this.getExpiredEnrollments();
  
  if (expiredEnrollments.length > 0) {
    const result = await this.updateMany(
      { 
        isActive: true,
        expiresAt: { $lte: moment().toDate() }
      },
      { 
        $set: { isActive: false } 
      }
    );
    
    console.log(`Removed ${result.modifiedCount} expired enrollments`);
    return result.modifiedCount;
  }
  
  return 0;
};

// Pre-save middleware to set enrollment type based on course
enrollmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Course = mongoose.model('Course');
      const course = await Course.findById(this.course);
      
      if (course) {
        this.enrollmentType = course.courseType === 1 ? 'paid' : 'free';
        
        // Set payment amount for paid courses
        if (course.courseType === 1) {
          this.paymentDetails.amount = course.price;
        }
      }
    } catch (error) {
      console.error('Error setting enrollment type:', error);
    }
  }
  next();
});

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
