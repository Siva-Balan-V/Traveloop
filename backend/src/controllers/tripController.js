const tripService = require('../services/tripService');
const Validator = require('../validators');
const { query } = require('../config/database');

class TripController {
  async getUserTrips(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await tripService.getUserTrips(req.user.user_id, parseInt(page), parseInt(limit));
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async createTrip(req, res, next) {
    try {
      const validation = Validator.validateTrip(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', fields: validation.errors } });
      }
      const trip = await tripService.createTrip(req.user.user_id, req.body);
      res.status(201).json({ success: true, data: trip });
    } catch (error) { next(error); }
  }

  async getTripById(req, res, next) {
    try {
      const trip = await tripService.getTripById(parseInt(req.params.id), req.user.user_id);
      res.json({ success: true, data: trip });
    } catch (error) { next(error); }
  }

  async updateTrip(req, res, next) {
    try {
      const trip = await tripService.updateTrip(parseInt(req.params.id), req.user.user_id, req.body);
      res.json({ success: true, data: trip });
    } catch (error) { next(error); }
  }

  async deleteTrip(req, res, next) {
    try {
      await tripService.deleteTrip(parseInt(req.params.id), req.user.user_id);
      res.json({ success: true, message: 'Trip deleted successfully' });
    } catch (error) { next(error); }
  }

  async getTripBudget(req, res, next) {
    try {
      const budget = await tripService.getTripBudget(parseInt(req.params.id), req.user.user_id);
      res.json({ success: true, data: budget });
    } catch (error) { next(error); }
  }

  async generateShareToken(req, res, next) {
    try {
      const result = await tripService.generateShareToken(parseInt(req.params.id), req.user.user_id);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getSharedTrip(req, res, next) {
    try {
      const trip = await tripService.getSharedTrip(req.params.token);
      res.json({ success: true, data: trip });
    } catch (error) { next(error); }
  }

  async getTripStops(req, res, next) {
    try {
      const result = await query(
        `SELECT ts.*, c.city_name, co.country_name,
          COALESCE(json_agg(
            json_build_object(
              'stop_activity_id', sa.stop_activity_id,
              'activity_id', sa.activity_id,
              'activity_name', a.activity_name,
              'scheduled_date', sa.scheduled_date,
              'actual_cost', sa.actual_cost,
              'is_completed', sa.is_completed
            )
          ) FILTER (WHERE sa.stop_activity_id IS NOT NULL), '[]') as activities
         FROM trip_stops ts
         JOIN cities c ON ts.city_id = c.city_id
         JOIN countries co ON c.country_id = co.country_id
         LEFT JOIN stop_activities sa ON ts.stop_id = sa.stop_id
         LEFT JOIN activities a ON sa.activity_id = a.activity_id
         WHERE ts.trip_id = $1
         GROUP BY ts.stop_id, c.city_name, co.country_name
         ORDER BY ts.stop_order`,
        [req.params.id]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) { next(error); }
  }

  async addStop(req, res, next) {
    try {
      const validation = Validator.validateStop(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', fields: validation.errors } });
      }
      const tripId = parseInt(req.params.id);
      await tripService.getTripById(tripId, req.user.user_id);

      const orderResult = await query(
        'SELECT COALESCE(MAX(stop_order), 0) + 1 as next_order FROM trip_stops WHERE trip_id = $1',
        [tripId]
      );
      const stopOrder = orderResult.rows[0].next_order;
      const { city_id, arrival_date, departure_date, accommodation_name, accommodation_cost, transportation_cost, notes } = req.body;

      const result = await query(
        `INSERT INTO trip_stops (trip_id, city_id, stop_order, arrival_date, departure_date, accommodation_name, accommodation_cost, transportation_cost, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [tripId, city_id, stopOrder, arrival_date, departure_date, accommodation_name || null, accommodation_cost || 0, transportation_cost || 0, notes || null]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) { next(error); }
  }

  async updateStop(req, res, next) {
    try {
      const { arrival_date, departure_date, accommodation_name, accommodation_cost, transportation_cost, notes } = req.body;
      const result = await query(
        `UPDATE trip_stops SET
           arrival_date = COALESCE($1, arrival_date),
           departure_date = COALESCE($2, departure_date),
           accommodation_name = COALESCE($3, accommodation_name),
           accommodation_cost = COALESCE($4, accommodation_cost),
           transportation_cost = COALESCE($5, transportation_cost),
           notes = COALESCE($6, notes)
         WHERE stop_id = $7 RETURNING *`,
        [arrival_date||null, departure_date||null, accommodation_name||null, accommodation_cost||null, transportation_cost||null, notes||null, req.params.stopId]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) { next(error); }
  }

  async deleteStop(req, res, next) {
    try {
      await query('DELETE FROM trip_stops WHERE stop_id = $1', [req.params.stopId]);
      res.json({ success: true, message: 'Stop deleted' });
    } catch (error) { next(error); }
  }

  async getNotes(req, res, next) {
    try {
      const result = await query(
        'SELECT * FROM trip_notes WHERE trip_id = $1 ORDER BY created_at DESC',
        [req.params.id]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) { next(error); }
  }

  async createNote(req, res, next) {
    try {
      const validation = Validator.validateNote(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', fields: validation.errors } });
      }
      const { note_title, note_content, note_date } = req.body;
      const result = await query(
        `INSERT INTO trip_notes (trip_id, note_title, note_content, note_date) VALUES ($1, $2, $3, $4) RETURNING *`,
        [req.params.id, note_title || null, note_content, note_date || null]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) { next(error); }
  }

  async updateNote(req, res, next) {
    try {
      const { note_title, note_content, note_date } = req.body;
      const result = await query(
        `UPDATE trip_notes SET note_title = COALESCE($1, note_title), note_content = COALESCE($2, note_content), note_date = COALESCE($3, note_date) WHERE note_id = $4 RETURNING *`,
        [note_title||null, note_content||null, note_date||null, req.params.noteId]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) { next(error); }
  }

  async deleteNote(req, res, next) {
    try {
      await query('DELETE FROM trip_notes WHERE note_id = $1', [req.params.noteId]);
      res.json({ success: true, message: 'Note deleted' });
    } catch (error) { next(error); }
  }

  async getPackingList(req, res, next) {
    try {
      const result = await query(
        'SELECT * FROM packing_items WHERE trip_id = $1 ORDER BY category, item_name',
        [req.params.id]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) { next(error); }
  }

  async addPackingItem(req, res, next) {
    try {
      const validation = Validator.validatePackingItem(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', fields: validation.errors } });
      }
      const { item_name, category, quantity } = req.body;
      const result = await query(
        `INSERT INTO packing_items (trip_id, item_name, category, quantity) VALUES ($1, $2, $3, $4) RETURNING *`,
        [req.params.id, item_name, category || null, quantity || 1]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) { next(error); }
  }

  async updatePackingItem(req, res, next) {
    try {
      const { item_name, category, quantity, is_packed } = req.body;
      const result = await query(
        `UPDATE packing_items SET
           item_name = COALESCE($1, item_name),
           category = COALESCE($2, category),
           quantity = COALESCE($3, quantity),
           is_packed = COALESCE($4, is_packed)
         WHERE item_id = $5 RETURNING *`,
        [item_name||null, category||null, quantity||null, is_packed??null, req.params.itemId]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) { next(error); }
  }

  async deletePackingItem(req, res, next) {
    try {
      await query('DELETE FROM packing_items WHERE item_id = $1', [req.params.itemId]);
      res.json({ success: true, message: 'Item deleted' });
    } catch (error) { next(error); }
  }
}

module.exports = new TripController();
