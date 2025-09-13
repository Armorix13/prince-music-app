import express from 'express';
import Joi from 'joi';
import { 
  signup, 
  login, 
  socialLogin,
  requestOTP,
  verifyOTP,
  verifyAccountOTP,
  verifyPasswordResetOTP,
  resetPassword,
  verifyEmailUpdateOTP,
  verifyPhoneUpdateOTP,
  requestPasswordResetOTP,
  getUserProfile, 
  updateUserProfile,
  logout,
  logoutAll,
  refreshToken,
  deleteAccount
} from '../controller/user.controller.js';
import { validateBody } from '../middlewares/validation.js';
import { 
  authenticate,
  loginRateLimit,
  apiRateLimit,
  trackDevice
} from '../middlewares/auth.js';
import { 
  userSignupSchema, 
  userLoginSchema, 
  socialLoginSchema,
  otpRequestSchema,
  otpVerificationSchema,
  accountVerificationSchema,
  forgotPasswordSchema,
  passwordResetRequestSchema,
  passwordResetVerificationSchema,
  passwordResetSchema,
  emailUpdateVerificationSchema,
  phoneUpdateVerificationSchema,
  userUpdateSchema,
  refreshTokenSchema
} from '../validation/index.js';

const router = express.Router();

// Apply rate limiting and device tracking to all routes
router.use(apiRateLimit);
router.use(trackDevice);

// Public routes (no authentication required)
router.post('/signup', validateBody(userSignupSchema), signup);
router.post('/login', loginRateLimit, validateBody(userLoginSchema), login);
router.post('/social-login', validateBody(socialLoginSchema), socialLogin);

// OTP routes
router.post('/request-otp', loginRateLimit, validateBody(otpRequestSchema), requestOTP);
router.post('/verify-otp', loginRateLimit, validateBody(otpVerificationSchema), verifyOTP);

// Specific OTP verification routes
router.post('/verify-account', loginRateLimit, validateBody(accountVerificationSchema), verifyAccountOTP);

// Forgot password (simple endpoint)
router.post('/forgot-password', loginRateLimit, validateBody(forgotPasswordSchema), requestPasswordResetOTP);

router.post('/request-password-reset', loginRateLimit, validateBody(passwordResetRequestSchema), requestPasswordResetOTP);

router.post('/verify-password-reset', loginRateLimit, validateBody(passwordResetVerificationSchema), verifyPasswordResetOTP);

router.post('/reset-password', loginRateLimit, validateBody(passwordResetSchema), resetPassword);

router.post('/verify-email-update', loginRateLimit, validateBody(emailUpdateVerificationSchema), verifyEmailUpdateOTP);

router.post('/verify-phone-update', loginRateLimit, validateBody(phoneUpdateVerificationSchema), verifyPhoneUpdateOTP);

router.post('/refresh-token', validateBody(refreshTokenSchema), refreshToken);

// Test email service (development only)
if (process.env.NODE_ENV === 'development') {
  router.post('/test-email', async (req, res) => {
    try {
      const emailService = (await import('../services/emailService.js')).default;
      await emailService.testEmailConfiguration();
      res.json({ success: true, message: 'Test email sent successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}

// Protected routes (authentication required)
router.use(authenticate); // All routes below require authentication

router.get('/profile', getUserProfile);
router.put('/profile', validateBody(userUpdateSchema), updateUserProfile);
router.post('/logout', logout);
router.post('/logout-all', logoutAll);
router.delete('/account', validateBody(Joi.object({ password: Joi.string().optional() })), deleteAccount);

export default router;
