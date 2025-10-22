import express from 'express';
import { uploadFile } from '../controller/upload.controller.js';
import { uploadSingle, handleUploadError } from '../middlewares/upload.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Simple file upload endpoint - pass file with key 'file' in multipart form data
router.post('/', 
  // authenticate,
  uploadSingle('file'),
  handleUploadError,
  uploadFile
);

// Test endpoint to check if file access is working
router.get('/test/:filename', (req, res) => {
  const { filename } = req.params;
  res.json({
    success: true,
    message: 'File access test',
    filename: filename,
    url: `/uploads/${filename}`,
    note: 'You can access this file directly using the URL above'
  });
});

export default router;