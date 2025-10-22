import { asyncHandler } from '../middlewares/errorHandler.js';
import { ValidationError } from '../utils/customError.js';
import { responseUtils } from '../utils/helpers.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple file upload - returns just the URL
export const uploadFile = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }

    const file = req.file;
    // Return the URL that can be accessed directly
    const fileUrl = `${process.env.BASE_URL}/uploads/${file.filename}`;

    responseUtils.success(res, 'File uploaded successfully', {
      url: fileUrl
    });

  } catch (error) {
    next(error);
  }
});
