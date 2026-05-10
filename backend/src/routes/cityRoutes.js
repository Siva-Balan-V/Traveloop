const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

router.get('/', async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;
    let sql, params;
    if (q) {
      sql = `SELECT c.city_id, c.city_name, c.description, c.image_url, c.cost_index, c.popularity_score,
               co.country_name, co.country_code
             FROM cities c JOIN countries co ON c.country_id = co.country_id
             WHERE c.city_name ILIKE $1 OR co.country_name ILIKE $1
             ORDER BY c.popularity_score DESC LIMIT $2`;
      params = [`%${q}%`, limit];
    } else {
      sql = `SELECT c.city_id, c.city_name, c.description, c.image_url, c.cost_index, c.popularity_score,
               co.country_name, co.country_code
             FROM cities c JOIN countries co ON c.country_id = co.country_id
             ORDER BY c.popularity_score DESC LIMIT $1`;
      params = [limit];
    }
    const result = await query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT c.*, co.country_name, co.country_code, co.currency as country_currency
       FROM cities c JOIN countries co ON c.country_id = co.country_id
       WHERE c.city_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: { message: 'City not found' } });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { next(error); }
});

module.exports = router;
