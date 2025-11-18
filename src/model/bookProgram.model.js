import mongoose from "mongoose";

const BookProgramSchema = new mongoose.Schema(
    {
        musicianId: {
            type: Number,
            required: true,
            index: true
        },
        numberOfPeople: {
            type: String,
            enum: ["upto-250", "250-500", "500-1000", "1000+"],
            required: true,
        },

        programType: {
            type: String,
            enum: ["indoor", "outdoor"],
            required: true,
        },

        location: {
            address: { type: String },   // Optional full address
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            selectedFromMap: { type: Boolean, default: false }, // true → map, false → current location
        },

        contactNumber: {
            countryCode: { type: String, default: "+91" },
            phone: { type: String, required: true },
        },

        programDate: {
            type: Date,
            required: true,
        },

        bookingStatus: {
            type: String,
            enum: ["pending", "accepted", "rejected", "completed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const BookProgram = mongoose.model("BookProgram", bookProgramSchema);
