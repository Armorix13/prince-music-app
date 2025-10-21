import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    dob: {
      type: Date,
    },
    socialType: {
      type: String,
      enum: ["google", "facebook", "apple", "normal"],
      default: "normal",
    },
    socialId: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    theme: {
      type: String,
    },
    loginAt: {
      type: Date,
      default: Date.now(),
    },
    otp: {
      type: String,
    },
    otpCreatedAt: {
      type: Date,
    },
    otpExpiresAt: {
      type: Date,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    otpFor: {
      type: String,
      enum: [
        "emailVerification",
        "resetPassword",
        "updateEmail",
        "updatePhoneNumber",
      ],
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    deviceType:{
      type: String,
      enum: ["android", "ios", "web"]
    },
    deviceToken:{
      type: String,
    },
    musicianId: {
      type: Number,
      required: true,
      ref: 'Musician'
    }
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
