import { Advertisement } from '../model/advertisement.model.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { responseUtils } from '../utils/helpers.js';
import { ValidationError } from '../utils/customError.js';

export const createAdvertisement = asyncHandler(async (req, res) => {
  const { title, description, photoUrl } = req.body;

  if (!title || !description) {
    throw new ValidationError('title and description are required');
  }

  const advertisementPayload = {
    title: title.trim(),
    description: description.trim()
  };

  if (photoUrl) {
    advertisementPayload.photoUrl = photoUrl.trim();
  }

  const advertisement = await Advertisement.create(advertisementPayload);

  return responseUtils.success(
    res,
    'Advertisement created successfully',
    { advertisement },
    201
  );
});

export const getAdvertisements = asyncHandler(async (req, res) => {
  const query = req.validatedQuery || req.query || {};
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;

  const [advertisements, total] = await Promise.all([
    Advertisement.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Advertisement.countDocuments()
  ]);

  return responseUtils.success(res, 'Advertisements fetched successfully', {
    items: advertisements,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

