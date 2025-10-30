import { asyncHandler } from '../middlewares/errorHandler.js';
import { NotFoundError } from '../utils/customError.js';
import { responseUtils, emailUtils } from '../utils/helpers.js';
import { Feedback } from '../model/feedback.model.js';
import { Musician } from '../model/musician.model.js';

// Create feedback for a musician
export const createFeedback = asyncHandler(async (req, res, next) => {
  try {
    const { musicianId, title, description, firstName, lastName, email } = req.body;

    // Optional: ensure musician exists when musicianId is provided
    if (musicianId) {
      const musician = await Musician.findOne({ musicianId });
      if (!musician) {
        throw new NotFoundError('Musician not found with the provided musicianId');
      }
    }

    const feedback = await Feedback.create({
      musicianId,
      title,
      description,
      firstName,
      lastName,
      email: emailUtils.normalizeEmail(email)
    });

    responseUtils.success(res, 'Feedback submitted successfully', { feedback }, 201);
  } catch (error) {
    next(error);
  }
});

// Get feedback list with pagination (optionally filter by musicianId)
export const listFeedback = asyncHandler(async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;
    const musicianId = req.query.musicianId ? Number(req.query.musicianId) : undefined;

    const filter = {};
    if (musicianId) filter.musicianId = musicianId;

    const [items, total] = await Promise.all([
      Feedback.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Feedback.countDocuments(filter)
    ]);

    responseUtils.success(res, 'Feedback fetched successfully', {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});


