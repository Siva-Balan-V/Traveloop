const authService = require('../services/authService');
const Validator = require('../validators');
const logger = require('../utils/logger');

class AuthController {
  async register(req, res, next) {
    try {
      const validation = Validator.validateRegistration(req.body);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            fields: validation.errors,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const user = await authService.register(req.body);

      res.status(201).json({
        success: true,
        data: {
          user,
          message: 'Registration successful. Please check your email to verify your account.',
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const validation = Validator.validateLogin(req.body);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            fields: validation.errors,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const { email, password } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get('user-agent');

      const result = await authService.login(email, password, ipAddress, userAgent);

      res.json({
        success: true,
        data: result,
        message: 'Login successful',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers.authorization?.substring(7);
      await authService.logout(req.user.user_id, token);

      res.json({
        success: true,
        message: 'Logout successful',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Verification token is required',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const user = await authService.verifyEmail(token);

      res.json({
        success: true,
        data: { user },
        message: 'Email verified successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email || !Validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Valid email is required',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const ipAddress = req.ip;
      await authService.requestPasswordReset(email, ipAddress);

      res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Reset token is required',
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (!password || !Validator.isStrongPassword(password)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
          },
          timestamp: new Date().toISOString(),
        });
      }

      await authService.resetPassword(token, password);

      res.json({
        success: true,
        message: 'Password reset successful. Please login with your new password.',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
