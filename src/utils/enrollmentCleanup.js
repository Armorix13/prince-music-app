import { Enrollment } from '../model/enrollment.model.js';
import moment from 'moment';

// Function to automatically remove expired enrollments
export const autoRemoveExpiredEnrollments = async () => {
  try {
    console.log('Starting automatic cleanup of expired enrollments...');
    
    const removedCount = await Enrollment.removeExpiredEnrollments();
    
    if (removedCount > 0) {
      console.log(`✅ Successfully removed ${removedCount} expired enrollments`);
    } else {
      console.log('ℹ️ No expired enrollments found');
    }
    
    return removedCount;
  } catch (error) {
    console.error('❌ Error during automatic cleanup:', error);
    throw error;
  }
};

// Function to get enrollment statistics
export const getEnrollmentStatistics = async () => {
  try {
    const totalEnrollments = await Enrollment.countDocuments({ isActive: true });
    const expiredEnrollments = await Enrollment.countDocuments({
      isActive: true,
      expiresAt: { $lte: new Date() }
    });
    const activeEnrollments = totalEnrollments - expiredEnrollments;
    
    return {
      total: totalEnrollments,
      active: activeEnrollments,
      expired: expiredEnrollments
    };
  } catch (error) {
    console.error('Error getting enrollment statistics:', error);
    throw error;
  }
};

// Function to notify users about expiring enrollments (optional)
export const notifyExpiringEnrollments = async (daysBeforeExpiry = 7) => {
  try {
    const expiryDate = moment().add(daysBeforeExpiry, 'days').toDate();
    const startDate = moment().add(daysBeforeExpiry - 1, 'days').toDate();
    
    const expiringEnrollments = await Enrollment.find({
      isActive: true,
      expiresAt: {
        $gte: startDate,
        $lte: expiryDate
      }
    }).populate('user', 'email firstName').populate('course', 'title');
    
    console.log(`Found ${expiringEnrollments.length} enrollments expiring in ${daysBeforeExpiry} days`);
    
    // Here you could send email notifications to users
    // For now, just log the information
    expiringEnrollments.forEach(enrollment => {
      console.log(`User ${enrollment.user.email} has course "${enrollment.course.title}" expiring on ${moment(enrollment.expiresAt).format('YYYY-MM-DD')}`);
    });
    
    return expiringEnrollments.length;
  } catch (error) {
    console.error('Error notifying expiring enrollments:', error);
    throw error;
  }
};
