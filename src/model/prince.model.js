import mongoose from "mongoose";

const socialMediaSchema = new mongoose.Schema({
  iconUrl: {
    type: String,
  },
  link: {
    type: String,
  }
});


const princeSchema = new mongoose.Schema(
  {
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
    }
  },
  {
    timestamps: true,
  }
);

export const Prince = mongoose.model("Prince", princeSchema);
