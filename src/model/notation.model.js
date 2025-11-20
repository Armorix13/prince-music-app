import mongoose from "mongoose";

const notationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    musicianId: {
      type: Number,
      required: true,
      index: true
    },
    songName: {
      type: String,
      required: true,
      trim: true
    },
    songReferenceUrl: {
      type: String,
      trim: true
    },
    videoUrl: {
      type: String,
      trim: true
    },
    audioUrl: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
notationSchema.index({ musicianId: 1, createdAt: -1 });
notationSchema.index({ userId: 1, createdAt: -1 });
notationSchema.index({ status: 1 });

export const Notation = mongoose.model("Notation", notationSchema);

