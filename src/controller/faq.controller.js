import { asyncHandler } from '../middlewares/errorHandler.js';
import { ValidationError } from '../utils/customError.js';
import { responseUtils } from '../utils/helpers.js';
import { Faq } from '../model/faq.model.js';

// Create a single FAQ
export const createFaq = asyncHandler(async (req, res, next) => {
  try {
    const { question, answer, isActive = true } = req.body;

    const faq = await Faq.create({ question, answer, isActive });

    responseUtils.success(res, 'FAQ created successfully', { faq }, 201);
  } catch (error) {
    next(error);
  }
});

// Create FAQs in bulk (array)
export const createFaqsBulk = asyncHandler(async (req, res, next) => {
  try {
    const { faqs } = req.body;
    if (!Array.isArray(faqs) || faqs.length === 0) {
      throw new ValidationError('faqs must be a non-empty array');
    }

    const docs = await Faq.insertMany(
      faqs.map(item => ({
        question: item.question,
        answer: item.answer,
        isActive: item.isActive !== undefined ? item.isActive : true
      }))
    );

    responseUtils.success(res, 'FAQs created successfully', { count: docs.length, faqs: docs }, 201);
  } catch (error) {
    next(error);
  }
});

// Get paginated FAQs
export const getFaqs = asyncHandler(async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;
    const isActive = req.query.isActive;

    const filter = {};
    if (isActive === 'true') filter.isActive = true;
    if (isActive === 'false') filter.isActive = false;

    const [items, total] = await Promise.all([
      Faq.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Faq.countDocuments(filter)
    ]);

    responseUtils.success(res, 'FAQs fetched successfully', {
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


