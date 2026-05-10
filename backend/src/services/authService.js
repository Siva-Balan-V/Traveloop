const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { query, transaction } = require('../config/database');
const logger = require('../utils/logger');
const emailService = require('./emailService');

class AuthService {
  async register(userData) {
    const { email, password, first_name, last_name, phone, city, country } = userData;

    const existingUser = await query(
      'SELECT user_id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const result = await transaction(async (client) => {
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, city, country, email_verification_token)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING user_id, email, first_name, last_name, created_at`,
        [email.toLowerCase(), passwordHash, first_name, last_name, phone || null, city || null, country || null, emailVerificationToken]
      );

      const user = userResult.rows[0];

      await client.query(
        `INSERT INTO user_preferences (user_id) VALUES ($1)`,
        [user.user_id]
      );

      await client.query(
        `INSERT INTO security_logs (user_id, event_type, event_description, success)
         VALUES ($1, $2, $3, $4)`,
        [user.user_id, 'REGISTRATION', 'User registered successfully', true]
      );

      return user;
    });

    try {
      await emailService.sendVerificationEmail(email, emailVerificationToken, first_name);
    } catch (emailError) {
      logger.warn('Verification email failed (email not configured)', { error: emailError.message });
    }

    logger.info('User registered', { userId: result.user_id, email });

    return result;
  }

  async login(email, password, ipAddress, userAgent) {
    const result = await query(
      `SELECT user_id, email, password_hash, first_name, last_name, is_email_verified, is_active
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      await this.logSecurityEvent(null, 'LOGIN_FAILED', 'Invalid email', false, ipAddress, userAgent);

      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const user = result.rows[0];

    if (!user.is_active) {
      await this.logSecurityEvent(user.user_id, 'LOGIN_FAILED', 'Account inactive', false, ipAddress, userAgent);
      const error = new Error('Account is inactive');
      error.statusCode = 403;
      error.code = 'ACCOUNT_INACTIVE';
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      await this.logSecurityEvent(user.user_id, 'LOGIN_FAILED', 'Invalid password', false, ipAddress, userAgent);
      
      await emailService.sendSuspiciousActivityEmail(user.email, ipAddress);

      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await query(
      `INSERT INTO user_sessions (user_id, token_hash, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.user_id, tokenHash, ipAddress, userAgent, expiresAt]
    );

    await query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE user_id = $1',
      [user.user_id]
    );

    await this.logSecurityEvent(user.user_id, 'LOGIN_SUCCESS', 'User logged in successfully', true, ipAddress, userAgent);

    logger.info('User logged in', { userId: user.user_id, email: user.email });

    return {
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_email_verified: user.is_email_verified,
      },
      token,
      refreshToken,
    };
  }

  async logout(userId, token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await query(
      'UPDATE user_sessions SET is_active = FALSE WHERE user_id = $1 AND token_hash = $2',
      [userId, tokenHash]
    );

    await this.logSecurityEvent(userId, 'LOGOUT', 'User logged out', true);

    logger.info('User logged out', { userId });
  }

  async verifyEmail(token) {
    const result = await query(
      `UPDATE users SET is_email_verified = TRUE, email_verification_token = NULL
       WHERE email_verification_token = $1 AND is_email_verified = FALSE
       RETURNING user_id, email`,
      [token]
    );

    if (result.rows.length === 0) {
      const error = new Error('Invalid or expired verification token');
      error.statusCode = 400;
      error.code = 'INVALID_TOKEN';
      throw error;
    }

    await this.logSecurityEvent(result.rows[0].user_id, 'EMAIL_VERIFICATION', 'Email verified successfully', true);

    logger.info('Email verified', { userId: result.rows[0].user_id });

    return result.rows[0];
  }

  async requestPasswordReset(email, ipAddress) {
    const result = await query(
      'SELECT user_id, first_name FROM users WHERE email = $1 AND is_active = TRUE',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return;
    }

    const user = result.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + parseInt(process.env.PASSWORD_RESET_EXPIRES) || 3600000);

    await query(
      `UPDATE users SET password_reset_token = $1, password_reset_expires = $2
       WHERE user_id = $3`,
      [resetToken, resetExpires, user.user_id]
    );

    try {
      await emailService.sendPasswordResetEmail(email, resetToken, user.first_name);
    } catch (emailError) {
      logger.warn('Reset email failed (email not configured)', { error: emailError.message });
    }

    await this.logSecurityEvent(user.user_id, 'PASSWORD_RESET_REQUEST', 'Password reset requested', true, ipAddress);

    logger.info('Password reset requested', { userId: user.user_id });
  }

  async resetPassword(token, newPassword) {
    const result = await query(
      `SELECT user_id, email FROM users
       WHERE password_reset_token = $1
       AND password_reset_expires > CURRENT_TIMESTAMP
       AND is_active = TRUE`,
      [token]
    );

    if (result.rows.length === 0) {
      const error = new Error('Invalid or expired reset token');
      error.statusCode = 400;
      error.code = 'INVALID_TOKEN';
      throw error;
    }

    const user = result.rows[0];
    const passwordHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);

    await query(
      `UPDATE users
       SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL
       WHERE user_id = $2`,
      [passwordHash, user.user_id]
    );

    await query(
      'UPDATE user_sessions SET is_active = FALSE WHERE user_id = $1',
      [user.user_id]
    );

    await this.logSecurityEvent(user.user_id, 'PASSWORD_RESET_SUCCESS', 'Password reset successfully', true);

    logger.info('Password reset', { userId: user.user_id });

    return user;
  }

  async logSecurityEvent(userId, eventType, description, success, ipAddress = null, userAgent = null) {
    await query(
      `INSERT INTO security_logs (user_id, event_type, event_description, success, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, eventType, description, success, ipAddress, userAgent]
    );
  }
}

module.exports = new AuthService();
