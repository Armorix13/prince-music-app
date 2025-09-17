import { Prince } from '../model/prince.model.js';
import { Section } from '../model/section.model.js';
import { CustomError } from '../utils/customError.js';

// Create or Update Prince Portfolio
export const createOrUpdatePortfolio = async (req, res, next) => {
  try {
    const {
      coverPhoto,
      profilePhoto,
      name,
      description,
      mail,
      contact,
      location,
      socialMedia
    } = req.body;

    // Check if Prince already exists
    let prince = await Prince.findOne({ mail });
    
    if (prince) {
      // Update existing Prince
      prince = await Prince.findByIdAndUpdate(
        prince._id,
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
      // Create new Prince
      prince = await Prince.create({
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
      message: prince.isNew ? 'Portfolio created successfully' : 'Portfolio updated successfully',
      data: prince
    });
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

// Add Content to Section (Single Prince)
export const addContentToSection = async (req, res, next) => {
  try {
    const { sectionTitle, content } = req.body;

    // Find the single Prince
    const prince = await Prince.findOne({ isActive: true });
    if (!prince) {
      return next(new CustomError('Prince not found', 404));
    }

    // Find or create section
    let section = await Section.findOne({ 
      title: sectionTitle, 
      princeId: prince._id 
    });

    if (!section) {
      // Create new section
      section = await Section.create({
        title: sectionTitle,
        princeId: prince._id,
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

// Get Complete Portfolio (Single Prince)
export const getPortfolio = async (req, res, next) => {
  try {
    // Find the single Prince
    const prince = await Prince.findOne({ isActive: true });
    if (!prince) {
      return next(new CustomError('Prince not found', 404));
    }

    // Find all sections for this Prince
    const sections = await Section.find({ 
      princeId: prince._id,
      isActive: true 
    }).sort({ order: 1 });

    // Format response
    const portfolioData = {
      coverPhoto: prince.coverPhoto,
      profilePhoto: prince.profilePhoto,
      name: prince.name,
      description: prince.description,
      mail: prince.mail,
      contact: prince.contact,
      location: prince.location,
      socialMedia: prince.socialMedia,
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

    // Find Prince by email
    const prince = await Prince.findOne({ mail: email });
    if (!prince) {
      return next(new CustomError('Prince not found', 404));
    }

    // Find all sections for this Prince
    const sections = await Section.find({ 
      princeId: prince._id,
      isActive: true 
    }).sort({ order: 1 });

    // Format response
    const portfolioData = {
      coverPhoto: prince.coverPhoto,
      profilePhoto: prince.profilePhoto,
      name: prince.name,
      description: prince.description,
      mail: prince.mail,
      contact: prince.contact,
      location: prince.location,
      socialMedia: prince.socialMedia,
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
    const { princeId, sectionTitle } = req.params;
    const { content } = req.body;

    // Find section
    const section = await Section.findOne({ 
      title: sectionTitle, 
      princeId: princeId 
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
    const { princeId, sectionTitle } = req.params;

    const section = await Section.findOneAndDelete({ 
      title: sectionTitle, 
      princeId: princeId 
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

// Get All Sections for Prince
export const getPrinceSections = async (req, res, next) => {
  try {
    const { princeId } = req.params;

    const sections = await Section.find({ 
      princeId: princeId,
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
