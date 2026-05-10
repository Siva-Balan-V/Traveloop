const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Validator = require('../validators');
const { query } = require('../config/database');

router.get('/', async (req, res, next) => {
  try {
    const { city, category, q, limit = 20 } = req.query;
    const conditions = ['a.is_active = TRUE'];
    const params = [];
    let i = 1;

    if (city) { conditions.push(`a.city_id = $${i++}`); params.push(city); }
    if (category) { conditions.push(`a.category_id = $${i++}`); params.push(category); }
    if (q) { conditions.push(`a.activity_name ILIKE $${i++}`); params.push(`%${q}%`); }

    params.push(limit);
    const result = await query(
      `SELECT a.*, ac.category_name, c.city_name
       FROM activities a
       LEFT JOIN activity_categories ac ON a.category_id = ac.category_id
       LEFT JOIN cities c ON a.city_id = c.city_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY a.popularity_score DESC LIMIT $${i}`,
      params
    );
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

router.post('/stops/:stopId', authenticate, async (req, res, next) => {
  try {
    const validation = Validator.validateActivity(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', fields: validation.errors } });
    }
    const { activity_id, scheduled_date, scheduled_time, actual_cost, duration_minutes, notes } = req.body;
    const result = await query(
      `INSERT INTO stop_activities (stop_id, activity_id, scheduled_date, scheduled_time, actual_cost, duration_minutes, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.params.stopId, activity_id, scheduled_date || null, scheduled_time || null, actual_cost || 0, duration_minutes || null, notes || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) { next(error); }
});

router.delete('/stop-activities/:id', authenticate, async (req, res, next) => {
  try {
    await query('DELETE FROM stop_activities WHERE stop_activity_id = $1', [req.params.id]);
    res.json({ success: true, message: 'Activity removed' });
  } catch (error) { next(error); }
});

module.exports = router;
