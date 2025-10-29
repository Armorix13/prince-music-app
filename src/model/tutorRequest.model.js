import mongoose from "mongoose";
import moment from "moment";

const tutorRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    musicianId: {
      type: Number,
      required: true,
      ref: 'Musician'
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    respondedAt: {
      type: Date,
      default: null
    },
    // Week identifier for tracking weekly requests (format: YYYY-WW, e.g., "2024-05")
    weekIdentifier: {
      type: String,
      required: true,
      index: true
    },
    // Store year and week number separately for easier querying
    year: {
      type: Number,
      required: true
    },
    week: {
      type: Number,
      required: true,
      min: 1,
      max: 53
    }
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one request per user per musician per week
tutorRequestSchema.index({ user: 1, musicianId: 1, year: 1, week: 1 }, { unique: true });
tutorRequestSchema.index({ user: 1, status: 1 });
tutorRequestSchema.index({ musicianId: 1, status: 1 });
tutorRequestSchema.index({ requestedAt: -1 });

// Static method to get current week identifier
tutorRequestSchema.statics.getCurrentWeekIdentifier = function() {
  const now = moment();
  return {
    year: now.year(),
    week: now.week(),
    identifier: `${now.year()}-${String(now.week()).padStart(2, '0')}`
  };
};

// Static method to check if user has requested this week
tutorRequestSchema.statics.hasRequestedThisWeek = async function(userId, musicianId) {
  const { year, week } = this.getCurrentWeekIdentifier();
  
  const existingRequest = await this.findOne({
    user: userId,
    musicianId: musicianId,
    year: year,
    week: week
  });
  
  return !!existingRequest;
};

// Static method to get user's request for this week
tutorRequestSchema.statics.getUserRequestThisWeek = async function(userId, musicianId) {
  const { year, week } = this.getCurrentWeekIdentifier();
  
  return await this.findOne({
    user: userId,
    musicianId: musicianId,
    year: year,
    week: week
  });
};

// Pre-validate middleware to set week identifiers (runs before validation)
tutorRequestSchema.pre('validate', function(next) {
  if (this.isNew || !this.weekIdentifier) {
    const weekInfo = this.constructor.getCurrentWeekIdentifier();
    this.year = weekInfo.year;
    this.week = weekInfo.week;
    this.weekIdentifier = weekInfo.identifier;
  }
  next();
});

// Also set in pre-save as backup
tutorRequestSchema.pre('save', function(next) {
  if (!this.weekIdentifier || !this.year || !this.week) {
    const weekInfo = this.constructor.getCurrentWeekIdentifier();
    this.year = weekInfo.year;
    this.week = weekInfo.week;
    this.weekIdentifier = weekInfo.identifier;
  }
  next();
});

// Method to check if request is from current week
tutorRequestSchema.methods.isFromCurrentWeek = function() {
  const currentWeek = this.constructor.getCurrentWeekIdentifier();
  return this.year === currentWeek.year && this.week === currentWeek.week;
};

export const TutorRequest = mongoose.model("TutorRequest", tutorRequestSchema);

