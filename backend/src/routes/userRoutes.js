const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { query } = require('../config/database');

router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.user_id, u.email, u.first_name, u.last_name, u.profile_photo_url,
         u.is_email_verified, u.language_preference, u.created_at, u.last_login_at,
         up.default_currency, up.date_format, up.time_format, up.theme,
         up.email_notifications, up.trip_reminders, up.public_profile
       FROM users u
       LEFT JOIN user_preferences up ON u.user_id = up.user_id
       WHERE u.user_id = $1`,
      [req.user.user_id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { next(error); }
});

router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { first_name, last_name, language_preference } = req.body;
    const result = await query(
      `UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name),
         language_preference = COALESCE($3, language_preference)
       WHERE user_id = $4
       RETURNING user_id, email, first_name, last_name, language_preference`,
      [first_name || null, last_name || null, language_preference || null, req.user.user_id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { next(error); }
});

router.put('/preferences', authenticate, async (req, res, next) => {
  try {
    const { default_currency, date_format, time_format, theme, email_notifications, trip_reminders, public_profile } = req.body;
    const result = await query(
      `INSERT INTO user_preferences (user_id, default_currency, date_format, time_format, theme, email_notifications, trip_reminders, public_profile)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id) DO UPDATE SET
         default_currency = COALESCE(EXCLUDED.default_currency, user_preferences.default_currency),
         date_format = COALESCE(EXCLUDED.date_format, user_preferences.date_format),
         time_format = COALESCE(EXCLUDED.time_format, user_preferences.time_format),
         theme = COALESCE(EXCLUDED.theme, user_preferences.theme),
         email_notifications = COALESCE(EXCLUDED.email_notifications, user_preferences.email_notifications),
         trip_reminders = COALESCE(EXCLUDED.trip_reminders, user_preferences.trip_reminders),
         public_profile = COALESCE(EXCLUDED.public_profile, user_preferences.public_profile)
       RETURNING *`,
      [req.user.user_id, default_currency || null, date_format || null, time_format || null,
       theme || null, email_notifications ?? null, trip_reminders ?? null, public_profile ?? null]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { next(error); }
});

module.exports = router;
