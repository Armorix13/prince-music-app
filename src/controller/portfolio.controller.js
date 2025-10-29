import { Musician } from '../model/musician.model.js';
import { Section } from '../model/section.model.js';
import { CustomError } from '../utils/customError.js';

// Create or Update Musician Portfolio
export const createOrUpdatePortfolio = async (req, res, next) => {
  try {
    const {
      musicianId,
      coverPhoto,
      profilePhoto,
      name,
      description,
      mail,
      contact,
      location,
      socialMedia
    } = req.body;

    // Check if Musician already exists by musicianId
    let musician = await Musician.findOne({ musicianId });
    
    if (musician) {
      // Update existing Musician
      musician = await Musician.findByIdAndUpdate(
        musician._id,
        {
          coverPhoto,
          profilePhoto,
          name,
          description,
          mail,
          contact,
          location,
          socialMedia
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new Musician
      musician = await Musician.create({
        musicianId,
        coverPhoto,
        profilePhoto,
        name,
        description,
        mail,
        contact,
        location,
        socialMedia
      });
    }

    res.status(200).json({
      success: true,
      message: musician.isNew ? 'Portfolio created successfully' : 'Portfolio updated successfully',
      data: musician
    });
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

// Add Content to Section
export const addContentToSection = async (req, res, next) => {
  try {
    const musicianId = req.user.musicianId;
    const { sectionTitle, content } = req.body;

    // Find the musician
    const musician = await Musician.findOne({ musicianId, isActive: true });
    if (!musician) {
      return next(new CustomError('Musician not found', 404));
    }

    // Find or create section
    let section = await Section.findOne({ 
      title: sectionTitle, 
      musicianId: musician._id 
    });

    if (!section) {
      // Create new section
      section = await Section.create({
        title: sectionTitle,
        musicianId: musician._id,
        content: [content]
      });
    } else {
      // Add content to existing section
      section.content.push(content);
      await section.save();
    }

    res.status(200).json({
      success: true,
      message: 'Content added to section successfully',
      data: section
    });
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

// Get Complete Portfolio by Musician ID
export const getPortfolio = async (req, res, next) => {
  try {
    const musicianId = req.user.musicianId;

    // Find the musician
    const musician = await Musician.findOne({ musicianId, isActive: true });
    if (!musician) {
      return next(new CustomError('Musician not found', 404));
    }

    // Find all sections for this musician
    const sections = await Section.find({ 
      musicianId: musician._id,
      isActive: true 
    }).sort({ order: 1 });

    // Format response
    const portfolioData = {
      musicianId: musician.musicianId,
      coverPhoto: musician.coverPhoto,
      profilePhoto: musician.profilePhoto,
      name: musician.name,
      description: musician.description,
      mail: musician.mail,
      contact: musician.contact,
      location: musician.location,
      socialMedia: musician.socialMedia,
      sections: sections.map(section => ({
        title: section.title,
        content: section.content
      }))
    };

    res.status(200).json({
      success: true,
      message: 'Portfolio retrieved successfully',
      data: portfolioData
    });
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

// Get Portfolio by Email
export const getPortfolioByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;

    // Find Musician by email
    const musician = await Musician.findOne({ mail: email });
    if (!musician) {
      return next(new CustomError('Musician not found', 404));
    }

    // Find all sections for this musician
    const sections = await Section.find({ 
      musicianId: musician._id,
      isActive: true 
    }).sort({ order: 1 });

    // Format response
    const portfolioData = {
      musicianId: musician.musicianId,
      coverPhoto: musician.coverPhoto,
      profilePhoto: musician.profilePhoto,
      name: musician.name,
      description: musician.description,
      mail: musician.mail,
      contact: musician.contact,
      location: musician.location,
      socialMedia: musician.socialMedia,
      sections: sections.map(section => ({
        title: section.title,
        content: section.content
      }))
    };

    res.status(200).json({
      success: true,
      message: 'Portfolio retrieved successfully',
      data: portfolioData
    });
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

// Update Section Content
export const updateSectionContent = async (req, res, next) => {
  try {
    const { musicianId, sectionTitle } = req.params;
    const { content } = req.body;

    // Find musician first
    const musician = await Musician.findOne({ musicianId });
    if (!musician) {
      return next(new CustomError('Musician not found', 404));
    }

    // Find section
    const section = await Section.findOne({ 
      title: sectionTitle, 
      musicianId: musician._id 
    });

    if (!section) {
      return next(new CustomError('Section not found', 404));
    }

    // Update content
    section.content = content;
    await section.save();

    res.status(200).json({
      success: true,
      message: 'Section content updated successfully',
      data: section
    });
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

// Delete Section
export const deleteSection = async (req, res, next) => {
  try {
    const { musicianId, sectionTitle } = req.params;

    // Find musician first
    const musician = await Musician.findOne({ musicianId });
    if (!musician) {
      return next(new CustomError('Musician not found', 404));
    }

    const section = await Section.findOneAndDelete({ 
      title: sectionTitle, 
      musicianId: musician._id 
    });

    if (!section) {
      return next(new CustomError('Section not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

// Get All Sections for Musician
export const getMusicianSections = async (req, res, next) => {
  try {
    const { musicianId } = req.params;

    // Find musician first
    const musician = await Musician.findOne({ musicianId });
    if (!musician) {
      return next(new CustomError('Musician not found', 404));
    }

    const sections = await Section.find({ 
      musicianId: musician._id,
      isActive: true 
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: 'Sections retrieved successfully',
      data: sections
    });
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};
