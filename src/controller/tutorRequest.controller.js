import { asyncHandler } from '../middlewares/errorHandler.js';
import { 
  ValidationError, 
  ConflictError, 
  NotFoundError
} from '../utils/customError.js';
import { responseUtils } from '../utils/helpers.js';
import { TutorRequest } from '../model/tutorRequest.model.js';
import { Musician } from '../model/musician.model.js';
import { User } from '../model/user.model.js';

// Request tutor (for authenticated users)
export const requestTutor = asyncHandler(async (req, res, next) => {
  try {
    const { musicianId, firstName, lastName, email, topic, message } = req.body;
    const userId = req.user.id;

    // Validate musicianId
    if (!musicianId) {
      throw new ValidationError('Musician ID is required');
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Find musician by musicianId (number, not ObjectId)
    const musicianIdNum = parseInt(musicianId);
    const musician = await Musician.findOne({ musicianId: musicianIdNum, isActive: true });
    if (!musician) {
      throw new NotFoundError('Musician not found or inactive');
    }

    // Check if user already requested this week
    const hasRequested = await TutorRequest.hasRequestedThisWeek(userId, musicianIdNum);
    if (hasRequested) {
      const existingRequest = await TutorRequest.getUserRequestThisWeek(userId, musicianIdNum);
      throw new ConflictError(
        `You have already requested this tutor for personal tutoring this week. Your request status is: ${existingRequest.status}`
      );
    }

    // Create new tutor request
    const tutorRequest = await TutorRequest.create({
      user: userId,
      musicianId: musicianIdNum,
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      topic,
      message,
      status: 'pending'
    });

    // Populate user details for response
    await tutorRequest.populate('user', 'firstName lastName email profileImage');

    responseUtils.success(res, 'Tutor request submitted successfully', {
      request: {
        id: tutorRequest._id,
        user: {
          id: tutorRequest.user._id,
          firstName: tutorRequest.user.firstName,
          lastName: tutorRequest.user.lastName,
          email: tutorRequest.user.email
        },
        firstName: tutorRequest.firstName,
        lastName: tutorRequest.lastName,
        email: tutorRequest.email,
        topic: tutorRequest.topic,
        message: tutorRequest.message,
        musician: {
          musicianId: musician.musicianId,
          name: musician.name,
          profilePhoto: musician.profilePhoto
        },
        status: tutorRequest.status,
        requestedAt: tutorRequest.requestedAt,
        weekIdentifier: tutorRequest.weekIdentifier
      }
    }, 201);

  } catch (error) {
    next(error);
  }
});

// Check tutor request status (for authenticated users)
export const checkTutorRequestStatus = asyncHandler(async (req, res, next) => {
  try {
    const { musicianId } = req.query;
    const userId = req.user.id;

    // Validate musicianId
    if (!musicianId) {
      throw new ValidationError('Musician ID is required');
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if musician exists
    const musician = await Musician.findOne({ musicianId: parseInt(musicianId), isActive: true });
    if (!musician) {
      throw new NotFoundError('Musician not found or inactive');
    }

    // Get user's request for this week
    const tutorRequest = await TutorRequest.getUserRequestThisWeek(userId, parseInt(musicianId));

    if (!tutorRequest) {
      responseUtils.success(res, 'No request found for this week', {
        hasRequested: false,
        request: null
      });
      return;
    }

    // Populate user details for response
    await tutorRequest.populate('user', 'firstName lastName email profileImage');

    responseUtils.success(res, 'Tutor request status retrieved successfully', {
      hasRequested: true,
      request: {
        id: tutorRequest._id,
        user: {
          id: tutorRequest.user._id,
          firstName: tutorRequest.user.firstName,
          lastName: tutorRequest.user.lastName,
          email: tutorRequest.user.email
        },
        musician: {
          musicianId: musician.musicianId,
          name: musician.name,
          profilePhoto: musician.profilePhoto
        },
        firstName: tutorRequest.firstName,
        lastName: tutorRequest.lastName,
        email: tutorRequest.email,
        topic: tutorRequest.topic,
        message: tutorRequest.message,
        status: tutorRequest.status,
        requestedAt: tutorRequest.requestedAt,
        respondedAt: tutorRequest.respondedAt,
        weekIdentifier: tutorRequest.weekIdentifier,
        isFromCurrentWeek: tutorRequest.isFromCurrentWeek()
      }
    });

  } catch (error) {
    next(error);
  }
});

