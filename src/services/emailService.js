import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = {};
    this.initializeTransporter();
    this.loadTemplates();
  }

  // Initialize SMTP transporter
  initializeTransporter() {
    try {
      // Only initialize if SMTP credentials are provided
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('⚠️ SMTP credentials not provided. Email service will be disabled.');
        this.transporter = null;
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true' || false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify transporter configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ SMTP configuration error:', error);
          this.transporter = null; // Disable email service if verification fails
        } else {
          console.log('✅ SMTP server is ready to send emails');
        }
      });
    } catch (error) {
      console.error('❌ Failed to initialize SMTP transporter:', error);
      this.transporter = null;
    }
  }

  // Load HTML templates
  loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, '../templates');
      
      this.templates = {
        emailVerification: fs.readFileSync(path.join(templatesDir, 'email-verification.html'), 'utf8'),
        passwordReset: fs.readFileSync(path.join(templatesDir, 'password-reset.html'), 'utf8'),
        emailUpdate: fs.readFileSync(path.join(templatesDir, 'email-update.html'), 'utf8'),
        phoneUpdate: fs.readFileSync(path.join(templatesDir, 'phone-update.html'), 'utf8')
      };
      
      console.log('✅ Email templates loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load email templates:', error);
    }
  }

  // Replace template variables
  replaceTemplateVariables(template, variables) {
    let html = template;
    
    // Replace all variables in the template
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, variables[key] || '');
    });
    
    return html;
  }

  // Send OTP email for email verification
  async sendEmailVerificationOTP(userData) {
    try {
      const { email, firstName, otp } = userData;
      
      const variables = {
        firstName: firstName || 'User',
        otp: otp,
        appUrl: process.env.APP_URL || 'https://princemusicapp.com',
        privacyUrl: process.env.PRIVACY_URL || 'https://princemusicapp.com/privacy',
        termsUrl: process.env.TERMS_URL || 'https://princemusicapp.com/terms'
      };

      const html = this.replaceTemplateVariables(this.templates.emailVerification, variables);

      const mailOptions = {
        from: {
          name: 'Prince Music App',
          address: process.env.SMTP_FROM || process.env.SMTP_USER
        },
        to: email,
        subject: '🎵 Verify Your Email - Prince Music App',
        html: html,
        text: `Hello ${firstName}! Your verification code is: ${otp}. This code will expire in 10 minutes.`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email verification OTP sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send email verification OTP:', error);
      throw new Error(`Failed to send email verification OTP: ${error.message}`);
    }
  }

  // Send OTP email for password reset
  async sendPasswordResetOTP(userData) {
    try {
      const { email, firstName, otp } = userData;
      
      const variables = {
        firstName: firstName || 'User',
        otp: otp,
        appUrl: process.env.APP_URL || 'https://princemusicapp.com',
        privacyUrl: process.env.PRIVACY_URL || 'https://princemusicapp.com/privacy',
        termsUrl: process.env.TERMS_URL || 'https://princemusicapp.com/terms'
      };

      const html = this.replaceTemplateVariables(this.templates.passwordReset, variables);

      const mailOptions = {
        from: {
          name: 'Prince Music App',
          address: process.env.SMTP_FROM || process.env.SMTP_USER
        },
        to: email,
        subject: '🔐 Password Reset - Prince Music App',
        html: html,
        text: `Hello ${firstName}! Your password reset code is: ${otp}. This code will expire in 10 minutes.`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset OTP sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send password reset OTP:', error);
      throw new Error(`Failed to send password reset OTP: ${error.message}`);
    }
  }

  // Send OTP email for email update
  async sendEmailUpdateOTP(userData) {
    try {
      const { email, firstName, otp, newEmail, currentEmail } = userData;
      
      const variables = {
        firstName: firstName || 'User',
        otp: otp,
        newEmail: newEmail,
        currentEmail: currentEmail,
        appUrl: process.env.APP_URL || 'https://princemusicapp.com',
        privacyUrl: process.env.PRIVACY_URL || 'https://princemusicapp.com/privacy',
        termsUrl: process.env.TERMS_URL || 'https://princemusicapp.com/terms'
      };

      const html = this.replaceTemplateVariables(this.templates.emailUpdate, variables);

      const mailOptions = {
        from: {
          name: 'Prince Music App',
          address: process.env.SMTP_FROM || process.env.SMTP_USER
        },
        to: email,
        subject: '📧 Email Update Verification - Prince Music App',
        html: html,
        text: `Hello ${firstName}! Your email update verification code is: ${otp}. This code will expire in 10 minutes.`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email update OTP sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send email update OTP:', error);
      throw new Error(`Failed to send email update OTP: ${error.message}`);
    }
  }

  // Send OTP email for phone update
  async sendPhoneUpdateOTP(userData) {
    try {
      const { email, firstName, otp, newPhone, currentPhone } = userData;
      
      const variables = {
        firstName: firstName || 'User',
        otp: otp,
        newPhone: newPhone,
        currentPhone: currentPhone,
        appUrl: process.env.APP_URL || 'https://princemusicapp.com',
        privacyUrl: process.env.PRIVACY_URL || 'https://princemusicapp.com/privacy',
        termsUrl: process.env.TERMS_URL || 'https://princemusicapp.com/terms'
      };

      const html = this.replaceTemplateVariables(this.templates.phoneUpdate, variables);

      const mailOptions = {
        from: {
          name: 'Prince Music App',
          address: process.env.SMTP_FROM || process.env.SMTP_USER
        },
        to: email,
        subject: '📱 Phone Update Verification - Prince Music App',
        html: html,
        text: `Hello ${firstName}! Your phone update verification code is: ${otp}. This code will expire in 10 minutes.`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Phone update OTP sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send phone update OTP:', error);
      throw new Error(`Failed to send phone update OTP: ${error.message}`);
    }
  }

  // Generic OTP sender based on purpose
  async sendOTP(userData, otpFor) {
    try {
      // Check if SMTP is configured
      if (!this.transporter) {
        console.log('⚠️ SMTP not configured. OTP email not sent.');
        return { success: false, message: 'Email service not configured' };
      }

      switch (otpFor) {
        case 'emailVerification':
          return await this.sendEmailVerificationOTP(userData);
        case 'resetPassword':
          return await this.sendPasswordResetOTP(userData);
        case 'updateEmail':
          return await this.sendEmailUpdateOTP(userData);
        case 'updatePhoneNumber':
          return await this.sendPhoneUpdateOTP(userData);
        default:
          throw new Error(`Unknown OTP purpose: ${otpFor}`);
      }
    } catch (error) {
      console.error(`❌ Failed to send OTP for ${otpFor}:`, error);
      throw error;
    }
  }

  // Send custom email
  async sendCustomEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: {
          name: 'Prince Music App',
          address: process.env.SMTP_FROM || process.env.SMTP_USER
        },
        to: to,
        subject: subject,
        html: html,
        text: text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Custom email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send custom email:', error);
      throw new Error(`Failed to send custom email: ${error.message}`);
    }
  }

  // Test email configuration
  async testEmailConfiguration() {
    try {
      const testEmail = {
        from: {
          name: 'Prince Music App',
          address: process.env.SMTP_FROM || process.env.SMTP_USER
        },
        to: process.env.SMTP_USER,
        subject: '🧪 SMTP Configuration Test - Prince Music App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>🎵 Prince Music App - SMTP Test</h2>
            <p>This is a test email to verify your SMTP configuration is working correctly.</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p>If you received this email, your SMTP configuration is working properly!</p>
          </div>
        `,
        text: 'This is a test email to verify your SMTP configuration is working correctly.'
      };

      const result = await this.transporter.sendMail(testEmail);
      console.log('✅ SMTP test email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ SMTP test failed:', error);
      throw new Error(`SMTP test failed: ${error.message}`);
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

export default emailService;
