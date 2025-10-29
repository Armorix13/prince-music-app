// User validation schemas
export {
  userSignupSchema,
  userLoginSchema,
  userUpdateSchema,
  changePasswordSchema
} from './user.validation.js';

// Authentication validation schemas
export {
  socialLoginSchema,
  refreshTokenSchema,
  deviceInfoSchema
} from './auth.validation.js';

// OTP validation schemas
export {
  otpRequestSchema,
  otpVerificationSchema,
  accountVerificationSchema,
  forgotPasswordSchema,
  passwordResetRequestSchema,
  passwordResetVerificationSchema,
  passwordResetSchema,
  emailUpdateVerificationSchema,
  phoneUpdateVerificationSchema
} from './otp.validation.js';

// Common validation schemas
export {
  idSchema,
  paginationSchema,
  searchSchema,
  fileUploadSchema,
  commonSchemas
} from './common.validation.js';

// Tutor request validation schemas
export {
  requestTutorSchema,
  checkTutorRequestStatusSchema
} from './tutorRequest.validation.js';

// Re-export all schemas for convenience
export * from './user.validation.js';
export * from './auth.validation.js';
export * from './otp.validation.js';
export * from './common.validation.js';
export * from './tutorRequest.validation.js';
