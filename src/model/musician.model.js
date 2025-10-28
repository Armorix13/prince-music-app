import mongoose from "mongoose";

const socialMediaSchema = new mongoose.Schema({
  iconUrl: {
    type: String,
  },
  link: {
    type: String,
  }
});


const musicianSchema = new mongoose.Schema(
  {
    musicianId: {
      type: Number,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    coverPhoto: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    mail: {
      type: String,
    },
    contact: {
      type: String,
    },
    location: {
      type: String
    },
    socialMedia: [socialMediaSchema],
    isActive: {
      type: Boolean,
      default: true
    },
    isProfileCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

// Auto-increment musicianId
musicianSchema.pre('save', async function(next) {
  if (this.isNew && !this.musicianId) {
    const lastMusician = await Musician.findOne({}, {}, { sort: { musicianId: -1 } });
    this.musicianId = lastMusician ? lastMusician.musicianId + 1 : 1;
  }
  next();
});

export const Musician = mongoose.model("Musician", musicianSchema);
