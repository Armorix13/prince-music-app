import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 5000
    },
    photoUrl: {
      type: String,
      required: false,
      trim: true,
      default: null
    }
  },
  {
    timestamps: true
  }
);

advertisementSchema.index({ createdAt: -1 });

export const Advertisement = mongoose.model('Advertisement', advertisementSchema);

