import mongoose from "mongoose";

// Helper: send server error
const handleServerError = (res, err) => {
  console.error(err);
  return res.status(500).json({ success: false, message: "Server error" });
};

/**
 * Create a new booking (Book a Program)
 * POST /api/bookprograms
 */
export const createBookProgram = async (req, res) => {
  try {
    const {
      musicianId,
      numberOfPeople,
      programType,
      location,
      contactNumber,
      programDate,
    } = req.body;

    // musicianId fallback to authenticated user if available (assumes req.user.id or req.user._id)
    const rawMusicianId = musicianId ?? (req.user && (req.user.id ?? req.user._id));
    if (rawMusicianId === undefined || rawMusicianId === null) {
      return res.status(400).json({ success: false, message: "musicianId is required" });
    }

    // Your model's musicianId is Number — coerce and validate
    const mId = Number(rawMusicianId);
    if (Number.isNaN(mId)) {
      return res.status(400).json({ success: false, message: "musicianId must be a number" });
    }

    // Validate required fields
    if (!numberOfPeople || !programType || !location || !contactNumber || !programDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Basic location validation
    if (location.lat === undefined || location.lng === undefined) {
      return res.status(400).json({ success: false, message: "Location lat/lng are required" });
    }
    if (typeof location.lat !== "number" || typeof location.lng !== "number") {
      return res.status(400).json({ success: false, message: "Location lat and lng must be numbers" });
    }

    // Validate enums (extra safety)
    const validPeople = ["upto-250", "250-500", "500-1000", "1000+"];
    if (!validPeople.includes(numberOfPeople)) {
      return res.status(400).json({ success: false, message: "Invalid numberOfPeople value" });
    }
    const validTypes = ["indoor", "outdoor"];
    if (!validTypes.includes(programType)) {
      return res.status(400).json({ success: false, message: "Invalid programType value" });
    }

    // parse and validate date
    const parsedDate = new Date(programDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid programDate" });
    }

        const booking = await BookProgram.create({
      musicianId: mId,
      numberOfPeople,
      programType,
      location,
      contactNumber,
      programDate: parsedDate,
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (err) {
    return handleServerError(res, err);
  }
};

/**
 * Get all bookings (with optional filters)
 * GET /api/bookprograms
 * Query params: musicianId, status, page, limit
 */
export const getBookPrograms = async (req, res) => {
  try {
    const { musicianId, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    // musicianId filtering (coerce to number if provided)
    if (musicianId !== undefined) {
      const m = Number(musicianId);
      if (Number.isNaN(m)) {
        return res.status(400).json({ success: false, message: "musicianId must be a number" });
      }
      filter.musicianId = m;
    }

    if (status) {
      filter.bookingStatus = status;
    }

    // If the user is a musician and no musicianId passed, restrict to their bookings
    if (!filter.musicianId && req.user && req.user.role === "musician") {
      const mFromUser = Number(req.user.id ?? req.user._id);
      if (!Number.isNaN(mFromUser)) filter.musicianId = mFromUser;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [total, bookings] = await Promise.all([
      BookProgram.countDocuments(filter),
      BookProgram.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    ]);

    return res.json({
      success: true,
      meta: { total, page: pageNum, limit: limitNum },
      data: bookings,
    });
  } catch (err) {
    return handleServerError(res, err);
  }
};

/**
 * Get single booking by id
 * GET /api/bookprograms/:id
 */
export const getBookProgramById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid booking id" });
    }

    const booking = await BookProgram.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    return res.json({ success: true, data: booking });
  } catch (err) {
    return handleServerError(res, err);
  }
};

/**
 * Update booking
 * PATCH /api/bookprograms/:id
 */
export const updateBookProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid booking id" });
    }

    const booking = await BookProgram.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Authorization: if musician role, allow only owner
    if (req.user && req.user.role === "musician") {
      const userMusicianId = Number(req.user.id ?? req.user._id);
      if (!Number.isNaN(userMusicianId) && booking.musicianId !== userMusicianId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this booking" });
      }
    }

    // whitelist of updatable fields
    const allowed = [
      "bookingStatus",
      "programDate",
      "contactNumber",
      "location",
      "numberOfPeople",
      "programType",
    ];

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        // small per-field validation:
        if (key === "programDate") {
          const d = new Date(updates.programDate);
          if (Number.isNaN(d.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid programDate" });
          }
          booking.programDate = d;
        } else if (key === "numberOfPeople") {
          const validPeople = ["upto-250", "250-500", "500-1000", "1000+"];
          if (!validPeople.includes(updates.numberOfPeople)) {
            return res.status(400).json({ success: false, message: "Invalid numberOfPeople" });
          }
          booking.numberOfPeople = updates.numberOfPeople;
        } else if (key === "programType") {
          const validTypes = ["indoor", "outdoor"];
          if (!validTypes.includes(updates.programType)) {
            return res.status(400).json({ success: false, message: "Invalid programType" });
          }
          booking.programType = updates.programType;
        } else if (key === "location") {
          if (
            updates.location.lat === undefined ||
            updates.location.lng === undefined ||
            typeof updates.location.lat !== "number" ||
            typeof updates.location.lng !== "number"
          ) {
            return res.status(400).json({ success: false, message: "Invalid location" });
          }
          booking.location = updates.location;
        } else {
          // contactNumber and bookingStatus no additional checks here (could add more)
          booking[key] = updates[key];
        }
      }
    }

    await booking.save();
    return res.json({ success: true, data: booking });
  } catch (err) {
    return handleServerError(res, err);
  }
};

/**
 * Delete booking
 * DELETE /api/bookprograms/:id
 */
export const deleteBookProgram = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid booking id" });
    }

    const booking = await BookProgram.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Authorization: if musician role, allow only owner
    if (req.user && req.user.role === "musician") {
      const userMusicianId = Number(req.user.id ?? req.user._id);
      if (!Number.isNaN(userMusicianId) && booking.musicianId !== userMusicianId) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this booking" });
      }
    }

    await booking.deleteOne();
    return res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    return handleServerError(res, err);
  }
};
