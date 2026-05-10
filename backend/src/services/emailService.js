const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });

      logger.info('Email sent', { to, subject, messageId: info.messageId });
      return info;
    } catch (error) {
      logger.error('Email sending failed', { to, subject, error: error.message });
      throw error;
    }
  }

  async sendVerificationEmail(email, token, firstName) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Traveloop!</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>Thank you for registering with Traveloop. We're excited to help you plan your next adventure!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with Traveloop, please ignore this email.</p>
            <p>Happy travels!<br>The Traveloop Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Traveloop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Verify Your Traveloop Account', html);
  }

  async sendPasswordResetEmail(email, token, firstName) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>We received a request to reset your Traveloop account password.</p>
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <div class="warning">
              <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and ensure your account is secure.
            </div>
            <p>Best regards,<br>The Traveloop Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Traveloop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Reset Your Traveloop Password', html);
  }

  async sendSuspiciousActivityEmail(email, ipAddress) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; }
          .info { background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Security Alert</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <div class="alert">
              <strong>Failed Login Attempt Detected</strong>
              <p>We detected a failed login attempt on your Traveloop account.</p>
            </div>
            <div class="info">
              <p><strong>Details:</strong></p>
              <ul>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>IP Address:</strong> ${ipAddress || 'Unknown'}</li>
                <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Status:</strong> Login failed - Invalid credentials</li>
              </ul>
            </div>
            <p><strong>What should you do?</strong></p>
            <ul>
              <li>If this was you, please check your email and password and try again.</li>
              <li>If this wasn't you, your account may be at risk. We recommend changing your password immediately.</li>
              <li>Review your recent account activity for any suspicious behavior.</li>
            </ul>
            <p>If you need assistance, please contact our support team.</p>
            <p>Stay safe,<br>The Traveloop Security Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Traveloop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.sendEmail(email, '⚠️ Traveloop Security Alert - Failed Login Attempt', html);
    } catch (error) {
      logger.error('Failed to send suspicious activity email', { email, error: error.message });
    }
  }

  async sendTripReminderEmail(email, firstName, tripName, startDate) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .trip-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌍 Trip Reminder</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>Your upcoming trip is just around the corner!</p>
            <div class="trip-info">
              <h2>${tripName}</h2>
              <p><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</p>
            </div>
            <p>Don't forget to:</p>
            <ul>
              <li>Check your packing list</li>
              <li>Review your itinerary</li>
              <li>Confirm your bookings</li>
              <li>Check travel advisories</li>
            </ul>
            <p>Have an amazing trip!<br>The Traveloop Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Traveloop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `🌍 Reminder: ${tripName} is coming up!`, html);
  }
}

module.exports = new EmailService();
