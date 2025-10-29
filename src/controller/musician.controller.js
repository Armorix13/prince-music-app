import { asyncHandler } from '../middlewares/errorHandler.js';
import { 
  ValidationError, 
  ConflictError, 
  UnauthorizedError, 
  NotFoundError,
  ForbiddenError
} from '../utils/customError.js';
import { 
  passwordUtils, 
  jwtUtils, 
  emailUtils, 
  responseUtils 
} from '../utils/helpers.js';
import { User } from '../model/user.model.js';
import { Musician } from '../model/musician.model.js';
import emailService from '../services/emailService.js';

// Create musician (Admin only)
export const createMusician = asyncHandler(async (req, res, next) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      musicianName,
      description,
      mail,
      contact,
      location,
      socialMedia
    } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !phoneNumber || !musicianName) {
      throw new ValidationError('Email, first name, last name, phone number, and musician name are required');
    }

    // Use phoneNumber as default password if password not provided
    const finalPassword = phoneNumber;

    // Check if musician with this name already exists
    const existingMusician = await Musician.findOne({ name: musicianName });
    if (existingMusician) {
      throw new ConflictError('Musician with this name already exists');
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: emailUtils.normalizeEmail(email) });
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create musician first
    const musicianData = {
      name: musicianName,
      description,
      mail: mail || email,
      contact,
      location,
      socialMedia: socialMedia || [],
      isActive: true,
      isProfileCompleted: false
    };

    const musician = await Musician.create(musicianData);

    // Create user with musician role
    const hashedPassword = await passwordUtils.hashPassword(finalPassword);
    const userData = {
      email: emailUtils.normalizeEmail(email),
      firstName,
      lastName,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      socialType: 'normal',
      musicianId: musician.musicianId,
      role: 'musician',
      isEmailVerified: true, // Admin created users are pre-verified
      isOtpVerified: true,
      loginAt: new Date()
    };

    const user = await User.create(userData);

    // Link user to musician
    musician.userId = user._id;
    await musician.save();

    // Send credentials email to musician
    try {
      await emailService.sendMusicianCredentials({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: finalPassword,
        musicianName: musician.name,
        isCustomPassword: false
      });
      console.log('✅ Musician credentials email sent successfully');
    } catch (emailError) {
      console.error('⚠️ Failed to send musician credentials email:', emailError);
      // Don't throw error, just log it - musician creation is successful
    }

    responseUtils.success(res, 'Musician created successfully', {
      musician: {
        musicianId: musician.musicianId,
        name: musician.name,
        description: musician.description,
        mail: musician.mail,
        contact: musician.contact,
        location: musician.location,
        socialMedia: musician.socialMedia,
        isActive: musician.isActive,
        isProfileCompleted: musician.isProfileCompleted,
        userId: musician.userId,
        createdAt: musician.createdAt
      },
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        musicianId: user.musicianId,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      credentials: {
        email: user.email,
        phoneNumber: user.phoneNumber,
        defaultPassword: phoneNumber,
        note:'Password set to phone number'
      }
    }, 201);

  } catch (error) {
    next(error);
  }
});

// Musician login
export const musicianLogin = asyncHandler(async (req, res, next) => {
  try {
    const { email, password, deviceType, deviceToken } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ 
      email: emailUtils.normalizeEmail(email),
      role: 'musician'
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await passwordUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new UnauthorizedError('Please verify your email before logging in');
    }

    // Find musician
    const musician = await Musician.findOne({ musicianId: user.musicianId });
    if (!musician) {
      throw new NotFoundError('Musician profile not found');
    }

    // Update device info and login time
    user.deviceType = deviceType || user.deviceType;
    user.deviceToken = deviceToken || user.deviceToken;
    user.loginAt = new Date();
    await user.save();

    // Generate tokens
    const accessToken = jwtUtils.generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user._id, role: user.role });

    responseUtils.success(res, 'Musician login successful', {
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
        musicianId: user.musicianId,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isOtpVerified: user.isOtpVerified,
        loginAt: user.loginAt,
        createdAt: user.createdAt
      },
      musician: {
        musicianId: musician.musicianId,
        name: musician.name,
        description: musician.description,
        mail: musician.mail,
        contact: musician.contact,
        location: musician.location,
        coverPhoto: musician.coverPhoto,
        profilePhoto: musician.profilePhoto,
        socialMedia: musician.socialMedia,
        isActive: musician.isActive,
        isProfileCompleted: musician.isProfileCompleted,
        createdAt: musician.createdAt,
        updatedAt: musician.updatedAt
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

// Get musician profile
export const getMusicianProfile = asyncHandler(async (req, res, next) => {
  try {
    const musician = await Musician.findOne({ musicianId: req.user.musicianId });
    
    if (!musician) {
      throw new NotFoundError('Musician profile not found');
    }

    responseUtils.success(res, 'Musician profile retrieved successfully', {
      musician: {
        musicianId: musician.musicianId,
        name: musician.name,
        description: musician.description,
        mail: musician.mail,
        contact: musician.contact,
        location: musician.location,
        coverPhoto: musician.coverPhoto,
        profilePhoto: musician.profilePhoto,
        socialMedia: musician.socialMedia,
        isActive: musician.isActive,
        isProfileCompleted: musician.isProfileCompleted,
        createdAt: musician.createdAt,
        updatedAt: musician.updatedAt
      }
    });

  } catch (error) {
    next(error);
  }
});

// Update musician profile
export const updateMusicianProfile = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      description,
      mail,
      contact,
      location,
      coverPhoto,
      profilePhoto,
      socialMedia
    } = req.body;

    const musician = await Musician.findOne({ musicianId: req.user.musicianId });
    
    if (!musician) {
      throw new NotFoundError('Musician profile not found');
    }

    // Update fields
    if (name) musician.name = name;
    if (description !== undefined) musician.description = description;
    if (mail) musician.mail = mail;
    if (contact) musician.contact = contact;
    if (location !== undefined) musician.location = location;
    if (coverPhoto) musician.coverPhoto = coverPhoto;
    if (profilePhoto) musician.profilePhoto = profilePhoto;
    if (socialMedia) musician.socialMedia = socialMedia;

    // Check if profile is completed
    const requiredFields = ['name', 'description', 'mail', 'contact'];
    const hasRequiredFields = requiredFields.every(field => {
      if (field === 'description') return musician.description && musician.description.trim() !== '';
      return musician[field] && musician[field].trim() !== '';
    });

    musician.isProfileCompleted = hasRequiredFields && musician.profilePhoto !== undefined;

    await musician.save();

    responseUtils.success(res, 'Musician profile updated successfully', {
      musician: {
        musicianId: musician.musicianId,
        name: musician.name,
        description: musician.description,
        mail: musician.mail,
        contact: musician.contact,
        location: musician.location,
        coverPhoto: musician.coverPhoto,
        profilePhoto: musician.profilePhoto,
        socialMedia: musician.socialMedia,
        isActive: musician.isActive,
        isProfileCompleted: musician.isProfileCompleted,
        updatedAt: musician.updatedAt
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get all musicians (Admin only)
export const getAllMusicians = asyncHandler(async (req, res, next) => {
  try {
    const musicians = await Musician.find({ isActive: true })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    responseUtils.success(res, 'Musicians retrieved successfully', {
      musicians: musicians.map(musician => ({
        musicianId: musician.musicianId,
        name: musician.name,
        description: musician.description,
        mail: musician.mail,
        contact: musician.contact,
        location: musician.location,
        coverPhoto: musician.coverPhoto,
        profilePhoto: musician.profilePhoto,
        socialMedia: musician.socialMedia,
        isActive: musician.isActive,
        isProfileCompleted: musician.isProfileCompleted,
        user: musician.userId ? {
          id: musician.userId._id,
          firstName: musician.userId.firstName,
          lastName: musician.userId.lastName,
          email: musician.userId.email
        } : null,
        createdAt: musician.createdAt,
        updatedAt: musician.updatedAt
      }))
    });

  } catch (error) {
    next(error);
  }
});

// Delete musician (Admin only)
export const deleteMusician = asyncHandler(async (req, res, next) => {
  try {
    const { musicianId } = req.params;

    const musician = await Musician.findOne({ musicianId });
    
    if (!musician) {
      throw new NotFoundError('Musician not found');
    }

    // Delete user
    if (musician.userId) {
      await User.findByIdAndDelete(musician.userId);
    }

    // Delete musician
    await Musician.findByIdAndDelete(musician._id);

    responseUtils.success(res, 'Musician deleted successfully');

  } catch (error) {
    next(error);
  }
});

