import { asyncHandler } from '../middlewares/errorHandler.js';
import { 
  ValidationError, 
  ConflictError, 
  UnauthorizedError, 
  NotFoundError,
  InternalServerError 
} from '../utils/customError.js';
import { 
  passwordUtils, 
  jwtUtils, 
  emailUtils, 
  phoneUtils, 
  dateUtils,
  securityUtils,
  otpUtils,
  responseUtils 
} from '../utils/helpers.js';
import { User } from '../model/user.model.js';
import emailService from '../services/emailService.js';

// User signup controller
export const signup = asyncHandler(async (req, res, next) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      countryCode, 
      phoneNumber, 
      dob, 
      password,
      socialType = 'normal',
      socialId,
      profileImage,
      theme,
      deviceType,
      deviceToken
    } = req.body;

    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({ email: emailUtils.normalizeEmail(email) });
    if (existingUserByEmail) {
      throw new ConflictError('User with this email already exists');
    }

    // Check if user already exists by phone (if provided)
    if (phoneNumber && countryCode) {
      const existingUserByPhone = await User.findOne({ phoneNumber, countryCode });
      if (existingUserByPhone) {
        throw new ConflictError('User with this phone number already exists');
      }
    }

    // Additional validation using helper functions
    const emailValidation = emailUtils.validateEmail(email);
    if (!emailValidation.isValid) {
      throw new ValidationError(emailValidation.error);
    }

    if (phoneNumber && countryCode) {
      const phoneValidation = phoneUtils.validatePhoneNumber(phoneNumber, countryCode);
      if (!phoneValidation.isValid) {
        throw new ValidationError(phoneValidation.error);
      }
    }

    if (dob) {
      const dobValidation = dateUtils.validateDateOfBirth(dob);
      if (!dobValidation.isValid) {
        throw new ValidationError(dobValidation.error);
      }
    }

    // For normal signup, validate password
    if (socialType === 'normal' && password) {
      const passwordValidation = passwordUtils.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new ValidationError(passwordValidation.errors.join(', '));
      }
    }

    // Generate OTP for email verification
    const otp = otpUtils.generateOTP();
    const otpCreatedAt = new Date();
    const otpExpiresAt = otpUtils.getOTPExpiryTime(10); // 10 minutes

    // Create user
    const userData = {
      firstName,
      lastName,
      email: emailUtils.normalizeEmail(email),
      countryCode,
      phoneNumber,
      dob,
      socialType,
      socialId,
      profileImage,
      theme,
      deviceType,
      deviceToken,
      otp,
      otpCreatedAt,
      otpExpiresAt,
      otpFor: 'emailVerification',
      isOtpVerified: false,
      isEmailVerified: false,
      loginAt: new Date()
    };

    // Add password only for normal signup
    if (socialType === 'normal' && password) {
      userData.password = await passwordUtils.hashPassword(password);
    }

    const user = await User.create(userData);

    // Generate tokens
    const accessToken = jwtUtils.generateAccessToken({ id: user._id });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user._id });

    // TODO: Send OTP email
    // await emailService.sendOTPEmail(user.email, otp);

    // Send OTP email
    try {
      const emailResult = await emailService.sendOTP({
        email: user.email,
        firstName: user.firstName,
        otp: otp
      }, 'emailVerification');
      
      if (!emailResult.success) {
        console.log('⚠️ Email service not configured. OTP not sent via email.');
      }
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Don't throw error, just log it - user can still request OTP again
    }

    responseUtils.success(res, 'User created successfully. Please verify your email with the OTP sent.', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        socialType: user.socialType,
        profileImage: user.profileImage,
        theme: user.theme,
        deviceType: user.deviceType,
        isEmailVerified: user.isEmailVerified,
        isOtpVerified: user.isOtpVerified,
        loginAt: user.loginAt,
        createdAt: user.createdAt
      },
      tokens: {
        accessToken,
        refreshToken
      },
      otp: {
        expiresAt: otpExpiresAt,
        expiresIn: '10 minutes'
      }
    }, 201);

  } catch (error) {
    next(error);
  }
});

// User login controller
export const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password, deviceType, deviceToken } = req.body;

    // Find user by email
    const user = await User.findOne({ email: emailUtils.normalizeEmail(email) });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // For normal login, check password
    if (user.socialType === 'normal') {
      if (!password) {
        throw new UnauthorizedError('Password is required for normal login');
      }

      const isPasswordValid = await passwordUtils.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }
    }

    // Update device info and login time
    user.deviceType = deviceType || user.deviceType;
    user.deviceToken = deviceToken || user.deviceToken;
    user.loginAt = new Date();
    await user.save();

    // Generate tokens
    const accessToken = jwtUtils.generateAccessToken({ id: user._id });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user._id });

    responseUtils.success(res, 'Login successful', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        socialType: user.socialType,
        profileImage: user.profileImage,
        theme: user.theme,
        deviceType: user.deviceType,
        isEmailVerified: user.isEmailVerified,
        isOtpVerified: user.isOtpVerified,
        loginAt: user.loginAt,
        createdAt: user.createdAt
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    next(error);
  }
});

// Social login controller
export const socialLogin = asyncHandler(async (req, res, next) => {
  try {
    const { 
      socialType, 
      socialId, 
      email, 
      firstName, 
      lastName, 
      profileImage,
      deviceType,
      deviceToken
    } = req.body;

    // Check if user exists with this social ID
    let user = await User.findOne({ socialId, socialType });

    if (!user) {
      // Check if user exists with email
      if (email) {
        user = await User.findOne({ email: emailUtils.normalizeEmail(email) });
        
        if (user) {
          // Update existing user with social info
          user.socialType = socialType;
          user.socialId = socialId;
          user.profileImage = profileImage || user.profileImage;
        }
      }

      if (!user) {
        // Create new user
        const userData = {
          socialType,
          socialId,
          email: email ? emailUtils.normalizeEmail(email) : null,
          firstName,
          lastName,
          profileImage,
          deviceType,
          deviceToken,
          isEmailVerified: !!email, // If email provided, mark as verified
          isOtpVerified: true, // Social login doesn't need OTP
          loginAt: new Date()
        };

        user = await User.create(userData);
      }
    }

    // Update device info and login time
    user.deviceType = deviceType || user.deviceType;
    user.deviceToken = deviceToken || user.deviceToken;
    user.loginAt = new Date();
    await user.save();

    // Generate tokens
    const accessToken = jwtUtils.generateAccessToken({ id: user._id });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user._id });

    responseUtils.success(res, 'Social login successful', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        socialType: user.socialType,
        profileImage: user.profileImage,
        theme: user.theme,
        deviceType: user.deviceType,
        isEmailVerified: user.isEmailVerified,
        isOtpVerified: user.isOtpVerified,
        loginAt: user.loginAt,
        createdAt: user.createdAt
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    next(error);
  }
});

// Request OTP controller
export const requestOTP = asyncHandler(async (req, res, next) => {
  try {
    const { email, otpFor } = req.body;

    // Find user by email
    const user = await User.findOne({ email: emailUtils.normalizeEmail(email) });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Generate new OTP
    const otp = otpUtils.generateOTP();
    const otpCreatedAt = new Date();
    const otpExpiresAt = otpUtils.getOTPExpiryTime(10); // 10 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpCreatedAt = otpCreatedAt;
    user.otpExpiresAt = otpExpiresAt;
    user.otpFor = otpFor;
    user.isOtpVerified = false;
    await user.save();

    // TODO: Send OTP email/SMS based on otpFor
    // await emailService.sendOTPEmail(user.email, otp);

    // Send OTP email based on purpose
    try {
      const emailData = {
        email: user.email,
        firstName: user.firstName,
        otp: otp
      };

      // Add additional data for specific purposes
      if (otpFor === 'updateEmail') {
        emailData.newEmail = req.body.newEmail || user.email;
        emailData.currentEmail = user.email;
      } else if (otpFor === 'updatePhoneNumber') {
        emailData.newPhone = req.body.newPhone || user.phoneNumber;
        emailData.currentPhone = user.phoneNumber;
      }

      const emailResult = await emailService.sendOTP(emailData, otpFor);
      
      if (!emailResult.success) {
        console.log('⚠️ Email service not configured. OTP not sent via email.');
      }
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Don't throw error for email service issues
      console.log('⚠️ Email service error. OTP generated but not sent via email.');
    }

    responseUtils.success(res, 'OTP sent successfully', {
      email: user.email,
      otpFor,
      expiresAt: otpExpiresAt,
      expiresIn: '10 minutes'
    });

  } catch (error) {
    next(error);
  }
});

// Verify OTP controller
export const verifyOTP = asyncHandler(async (req, res, next) => {
  try {
    const { email, otp, otpFor } = req.body;

    // Find user by email
    const user = await User.findOne({ email: emailUtils.normalizeEmail(email) });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      throw new UnauthorizedError('Invalid OTP');
    }

    // Check if OTP is expired
    if (otpUtils.isOTPExpired(user.otpCreatedAt, 10)) {
      throw new UnauthorizedError('OTP has expired');
    }

    // Check if OTP is for the correct purpose
    if (user.otpFor !== otpFor) {
      throw new UnauthorizedError('OTP is not valid for this purpose');
    }

    // Mark OTP as verified
    user.isOtpVerified = true;
    user.otp = null; // Clear OTP after verification
    user.otpCreatedAt = null;
    user.otpExpiresAt = null;
    user.otpFor = null;

    // Update verification status based on purpose
    if (otpFor === 'emailVerification') {
      user.isEmailVerified = true;
    }

    await user.save();

    responseUtils.success(res, 'OTP verified successfully', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isOtpVerified: user.isOtpVerified
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    responseUtils.success(res, 'Profile retrieved successfully', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        socialType: user.socialType,
        socialId: user.socialId,
        profileImage: user.profileImage,
        theme: user.theme,
        deviceType: user.deviceType,
        isEmailVerified: user.isEmailVerified,
        isOtpVerified: user.isOtpVerified,
        loginAt: user.loginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    next(error);
  }
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      countryCode, 
      phoneNumber, 
      dob, 
      profileImage,
      theme,
      deviceType,
      deviceToken
    } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const emailValidation = emailUtils.validateEmail(email);
      if (!emailValidation.isValid) {
        throw new ValidationError(emailValidation.error);
      }

      const existingUser = await User.findOne({ email: emailUtils.normalizeEmail(email) });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new ConflictError('Email is already in use by another account');
      }

      // If email is changed, mark as unverified and generate OTP
      user.email = emailUtils.normalizeEmail(email);
      user.isEmailVerified = false;
      user.isOtpVerified = false;
      
      // Generate OTP for email verification
      const otp = otpUtils.generateOTP();
      user.otp = otp;
      user.otpCreatedAt = new Date();
      user.otpExpiresAt = otpUtils.getOTPExpiryTime(10);
      user.otpFor = 'updateEmail';
    }

    // Check if phone is being changed and if it already exists
    if ((phoneNumber && phoneNumber !== user.phoneNumber) || (countryCode && countryCode !== user.countryCode)) {
      const phoneValidation = phoneUtils.validatePhoneNumber(phoneNumber, countryCode);
      if (!phoneValidation.isValid) {
        throw new ValidationError(phoneValidation.error);
      }

      const existingUser = await User.findOne({ phoneNumber, countryCode });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new ConflictError('Phone number is already in use by another account');
      }

      user.phoneNumber = phoneNumber;
      user.countryCode = countryCode;
    }

    // Validate date of birth if provided
    if (dob && dob !== user.dob) {
      const dobValidation = dateUtils.validateDateOfBirth(dob);
      if (!dobValidation.isValid) {
        throw new ValidationError(dobValidation.error);
      }
      user.dob = dob;
    }

    // Update other fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profileImage) user.profileImage = profileImage;
    if (theme) user.theme = theme;
    if (deviceType) user.deviceType = deviceType;
    if (deviceToken) user.deviceToken = deviceToken;

    await user.save();

    responseUtils.success(res, 'Profile updated successfully', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        socialType: user.socialType,
        profileImage: user.profileImage,
        theme: user.theme,
        deviceType: user.deviceType,
        isEmailVerified: user.isEmailVerified,
        isOtpVerified: user.isOtpVerified,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    next(error);
  }
});

// Logout
export const logout = asyncHandler(async (req, res, next) => {
  try {
    // Clear device token
    const user = await User.findById(req.user.id);
    if (user) {
      user.deviceToken = null;
      await user.save();
    }

    responseUtils.success(res, 'Logged out successfully');

  } catch (error) {
    next(error);
  }
});

// Refresh token
export const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    // Verify refresh token
    const decoded = jwtUtils.verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Generate new tokens
    const newAccessToken = jwtUtils.generateAccessToken({ id: user._id });
    const newRefreshToken = jwtUtils.generateRefreshToken({ id: user._id });

    responseUtils.success(res, 'Tokens refreshed successfully', {
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    next(error);
  }
});

// Verify account OTP (for new signups)
export const verifyAccountOTP = asyncHandler(async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email: emailUtils.normalizeEmail(email) });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      throw new UnauthorizedError('Invalid OTP');
    }

    // Check if OTP is expired
    if (otpUtils.isOTPExpired(user.otpCreatedAt, 10)) {
      throw new UnauthorizedError('OTP has expired');
    }

    // Check if OTP is for email verification
    if (user.otpFor !== 'emailVerification') {
      throw new UnauthorizedError('OTP is not valid for account verification');
    }

    // Mark OTP as verified and email as verified
    user.isOtpVerified = true;
    user.isEmailVerified = true;
    user.otp = null;
    user.otpCreatedAt = null;
    user.otpExpiresAt = null;
    user.otpFor = null;

    await user.save();

    responseUtils.success(res, 'Account verified successfully', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isOtpVerified: user.isOtpVerified
      }
    });

  } catch (error) {
    next(error);
  }
});

// Verify password reset OTP
export const verifyPasswordResetOTP = asyncHandler(async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email: emailUtils.normalizeEmail(email) });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      throw new UnauthorizedError('Invalid OTP');
    }

    // Check if OTP is expired
    if (otpUtils.isOTPExpired(user.otpCreatedAt, 10)) {
      throw new UnauthorizedError('OTP has expired');
    }

    // Check if OTP is for password reset
    if (user.otpFor !== 'resetPassword') {
      throw new UnauthorizedError('OTP is not valid for password reset');
    }

    // Mark OTP as verified (but don't clear it yet - user needs to reset password)
    user.isOtpVerified = true;
    await user.save();

    responseUtils.success(res, 'OTP verified successfully. You can now reset your password.', {
      email: user.email,
      verified: true
    });

  } catch (error) {
    next(error);
  }
});

// Reset password after OTP verification
export const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email: emailUtils.normalizeEmail(email) });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if OTP matches and is verified
    if (user.otp !== otp || !user.isOtpVerified) {
      throw new UnauthorizedError('Invalid or unverified OTP');
    }

    // Check if OTP is expired
    if (otpUtils.isOTPExpired(user.otpCreatedAt, 10)) {
      throw new UnauthorizedError('OTP has expired');
    }

    // Check if OTP is for password reset
    if (user.otpFor !== 'resetPassword') {
      throw new UnauthorizedError('OTP is not valid for password reset');
    }

    // Validate new password
    const passwordValidation = passwordUtils.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new ValidationError(passwordValidation.errors.join(', '));
    }

    // Update password
    user.password = await passwordUtils.hashPassword(newPassword);
    user.otp = null;
    user.otpCreatedAt = null;
    user.otpExpiresAt = null;
    user.otpFor = null;
    user.isOtpVerified = false;

    await user.save();

    responseUtils.success(res, 'Password reset successfully. Please login with your new password.');

  } catch (error) {
    next(error);
  }
});

// Verify email update OTP
export const verifyEmailUpdateOTP = asyncHandler(async (req, res, next) => {
  try {
    const { email, otp, newEmail } = req.body;

    // Find user by email
    const user = await User.findOne({ email: emailUtils.normalizeEmail(email) });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      throw new UnauthorizedError('Invalid OTP');
    }

    // Check if OTP is expired
    if (otpUtils.isOTPExpired(user.otpCreatedAt, 10)) {
      throw new UnauthorizedError('OTP has expired');
    }

    // Check if OTP is for email update
    if (user.otpFor !== 'updateEmail') {
      throw new UnauthorizedError('OTP is not valid for email update');
    }

    // Validate new email
    const emailValidation = emailUtils.validateEmail(newEmail);
    if (!emailValidation.isValid) {
      throw new ValidationError(emailValidation.error);
    }

    // Check if new email already exists
    const existingUser = await User.findOne({ email: emailUtils.normalizeEmail(newEmail) });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      throw new ConflictError('Email is already in use by another account');
    }

    // Update email
    user.email = emailUtils.normalizeEmail(newEmail);
    user.isEmailVerified = true;
    user.isOtpVerified = true;
    user.otp = null;
    user.otpCreatedAt = null;
    user.otpExpiresAt = null;
    user.otpFor = null;

    await user.save();

    responseUtils.success(res, 'Email updated successfully', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isOtpVerified: user.isOtpVerified
      }
    });

  } catch (error) {
    next(error);
  }
});

// Verify phone update OTP
export const verifyPhoneUpdateOTP = asyncHandler(async (req, res, next) => {
  try {
    const { email, otp, newPhoneNumber, newCountryCode } = req.body;

    // Find user by email
    const user = await User.findOne({ email: emailUtils.normalizeEmail(email) });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      throw new UnauthorizedError('Invalid OTP');
    }

    // Check if OTP is expired
    if (otpUtils.isOTPExpired(user.otpCreatedAt, 10)) {
      throw new UnauthorizedError('OTP has expired');
    }

    // Check if OTP is for phone update
    if (user.otpFor !== 'updatePhoneNumber') {
      throw new UnauthorizedError('OTP is not valid for phone update');
    }

    // Validate new phone
    const phoneValidation = phoneUtils.validatePhoneNumber(newPhoneNumber, newCountryCode);
    if (!phoneValidation.isValid) {
      throw new ValidationError(phoneValidation.error);
    }

    // Check if new phone already exists
    const existingUser = await User.findOne({ phoneNumber: newPhoneNumber, countryCode: newCountryCode });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      throw new ConflictError('Phone number is already in use by another account');
    }

    // Update phone
    user.phoneNumber = newPhoneNumber;
    user.countryCode = newCountryCode;
    user.isOtpVerified = true;
    user.otp = null;
    user.otpCreatedAt = null;
    user.otpExpiresAt = null;
    user.otpFor = null;

    await user.save();

    responseUtils.success(res, 'Phone number updated successfully', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        isOtpVerified: user.isOtpVerified
      }
    });

  } catch (error) {
    next(error);
  }
});

// Request password reset OTP
export const requestPasswordResetOTP = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email: emailUtils.normalizeEmail(email) });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Generate new OTP
    const otp = otpUtils.generateOTP();
    const otpCreatedAt = new Date();
    const otpExpiresAt = otpUtils.getOTPExpiryTime(10); // 10 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpCreatedAt = otpCreatedAt;
    user.otpExpiresAt = otpExpiresAt;
    user.otpFor = 'resetPassword';
    user.isOtpVerified = false;
    await user.save();

    // Send OTP email
    try {
      const emailResult = await emailService.sendOTP({
        email: user.email,
        firstName: user.firstName,
        otp: otp
      }, 'resetPassword');
      
      if (!emailResult.success) {
        console.log('⚠️ Email service not configured. OTP not sent via email.');
      }
    } catch (emailError) {
      console.error('Failed to send password reset OTP email:', emailError);
      console.log('⚠️ Email service error. OTP generated but not sent via email.');
    }

    responseUtils.success(res, 'Password reset OTP sent successfully', {
      email: user.email,
      expiresAt: otpExpiresAt,
      expiresIn: '10 minutes'
    });

  } catch (error) {
    next(error);
  }
});

// Delete account
export const deleteAccount = asyncHandler(async (req, res, next) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // For normal users, verify password
    if (user.socialType === 'normal' && password) {
      const isPasswordValid = await passwordUtils.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Password is incorrect');
      }
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    responseUtils.success(res, 'Account deleted successfully');

  } catch (error) {
    next(error);
  }
});