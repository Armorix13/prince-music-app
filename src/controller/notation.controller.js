import { asyncHandler } from '../middlewares/errorHandler.js';
import { NotFoundError, ValidationError } from '../utils/customError.js';
import { responseUtils } from '../utils/helpers.js';
import { Notation } from '../model/notation.model.js';
import { Musician } from '../model/musician.model.js';
import { User } from '../model/user.model.js';

// Add notation request
export const addNotation = asyncHandler(async (req, res, next) => {
  try {
    const { musicianId, songName, songReferenceUrl, videoUrl, audioUrl } = req.body;
    const userId = req.user?.id;

    // Validate required fields
    if (!songName) {
      throw new ValidationError('Song name is required');
    }

    if (!musicianId) {
      throw new ValidationError('Musician ID is required');
    }

    // Validate musicianId exists
    const musicianIdNum = parseInt(musicianId);
    const musician = await Musician.findOne({ musicianId: musicianIdNum, isActive: true });
    if (!musician) {
      throw new NotFoundError('Musician not found or inactive');
    }

    // If userId is provided (authenticated user), validate it exists
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }
    }

    // Create notation request
    const notation = await Notation.create({
      userId: userId || null,
      musicianId: musicianIdNum,
      songName,
      songReferenceUrl: songReferenceUrl || null,
      videoUrl: videoUrl || null,
      audioUrl: audioUrl || null,
      status: 'pending'
    });

    responseUtils.success(res, 'Notation request submitted successfully', { notation }, 201);
  } catch (error) {
    next(error);
  }
});

// Get all notation requests (filtered by musicianId)
export const getAllNotation = asyncHandler(async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;
    const musicianId = req.query.musicianId ? Number(req.query.musicianId) : undefined;
    const status = req.query.status;

    // Build filter
    const filter = {};
    if (musicianId) {
      filter.musicianId = musicianId;
    }
    if (status) {
      filter.status = status;
    }

    // If user is authenticated and requesting their own notations
    if (req.user?.id && req.query.myNotations === 'true') {
      filter.userId = req.user.id;
    }

    const [items, total] = await Promise.all([
      Notation.find(filter)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notation.countDocuments(filter)
    ]);

    responseUtils.success(res, 'Notation requests fetched successfully', {
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

