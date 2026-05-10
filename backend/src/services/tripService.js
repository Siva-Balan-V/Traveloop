const crypto = require('crypto');
const { query, transaction } = require('../config/database');
const logger = require('../utils/logger');

class TripService {
  async createTrip(userId, tripData) {
    const { trip_name, description, start_date, end_date, cover_photo_url, currency } = tripData;

    const result = await query(
      `INSERT INTO trips (user_id, trip_name, description, start_date, end_date, cover_photo_url, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING trip_id, trip_name, description, start_date, end_date, cover_photo_url, 
                 is_public, total_budget, currency, created_at`,
      [userId, trip_name, description || null, start_date, end_date, cover_photo_url || null, currency || 'USD']
    );

    logger.info('Trip created', { userId, tripId: result.rows[0].trip_id });

    return result.rows[0];
  }

  async getUserTrips(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
        t.trip_id,
        t.trip_name,
        t.description,
        t.start_date,
        t.end_date,
        t.cover_photo_url,
        t.total_budget,
        t.currency,
        t.is_public,
        t.created_at,
        COUNT(DISTINCT ts.stop_id) as stop_count,
        COUNT(DISTINCT sa.activity_id) as activity_count,
        ARRAY_AGG(c.city_name ORDER BY ts.stop_order) FILTER (WHERE c.city_name IS NOT NULL) as cities
       FROM trips t
       LEFT JOIN trip_stops ts ON t.trip_id = ts.trip_id
       LEFT JOIN cities c ON ts.city_id = c.city_id
       LEFT JOIN stop_activities sa ON ts.stop_id = sa.stop_id
       WHERE t.user_id = $1
       GROUP BY t.trip_id
       ORDER BY t.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM trips WHERE user_id = $1',
      [userId]
    );

    return {
      trips: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(countResult.rows[0].total / limit),
      },
    };
  }

  async getTripById(tripId, userId = null) {
    const result = await query(
      `SELECT 
        t.*,
        u.first_name || ' ' || u.last_name as creator_name,
        COUNT(DISTINCT ts.stop_id) as stop_count,
        COUNT(DISTINCT sa.activity_id) as activity_count
       FROM trips t
       JOIN users u ON t.user_id = u.user_id
       LEFT JOIN trip_stops ts ON t.trip_id = ts.trip_id
       LEFT JOIN stop_activities sa ON ts.stop_id = sa.stop_id
       WHERE t.trip_id = $1
       GROUP BY t.trip_id, u.first_name, u.last_name`,
      [tripId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Trip not found');
      error.statusCode = 404;
      error.code = 'TRIP_NOT_FOUND';
      throw error;
    }

    const trip = result.rows[0];

    if (!trip.is_public && trip.user_id !== userId) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      error.code = 'ACCESS_DENIED';
      throw error;
    }

    return trip;
  }

  async updateTrip(tripId, userId, updateData) {
    const trip = await this.getTripById(tripId, userId);

    if (trip.user_id !== userId) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      error.code = 'ACCESS_DENIED';
      throw error;
    }

    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['trip_name', 'description', 'start_date', 'end_date', 'cover_photo_url', 'currency', 'is_public'];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(updateData[field]);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      return trip;
    }

    values.push(tripId);

    const result = await query(
      `UPDATE trips SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE trip_id = $${paramCount}
       RETURNING *`,
      values
    );

    logger.info('Trip updated', { userId, tripId });

    return result.rows[0];
  }

  async deleteTrip(tripId, userId) {
    const trip = await this.getTripById(tripId, userId);

    if (trip.user_id !== userId) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      error.code = 'ACCESS_DENIED';
      throw error;
    }

    await query('DELETE FROM trips WHERE trip_id = $1', [tripId]);

    logger.info('Trip deleted', { userId, tripId });
  }

  async generateShareToken(tripId, userId) {
    const trip = await this.getTripById(tripId, userId);

    if (trip.user_id !== userId) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      error.code = 'ACCESS_DENIED';
      throw error;
    }

    const shareToken = crypto.randomBytes(16).toString('hex');

    await query(
      'UPDATE trips SET is_public = TRUE, share_token = $1 WHERE trip_id = $2',
      [shareToken, tripId]
    );

    logger.info('Share token generated', { userId, tripId });

    return {
      share_token: shareToken,
      share_url: `${process.env.FRONTEND_URL}/shared/${shareToken}`,
    };
  }

  async getSharedTrip(shareToken) {
    const result = await query(
      `SELECT 
        t.*,
        u.first_name || ' ' || u.last_name as creator_name
       FROM trips t
       JOIN users u ON t.user_id = u.user_id
       WHERE t.share_token = $1 AND t.is_public = TRUE`,
      [shareToken]
    );

    if (result.rows.length === 0) {
      const error = new Error('Shared trip not found');
      error.statusCode = 404;
      error.code = 'TRIP_NOT_FOUND';
      throw error;
    }

    return result.rows[0];
  }

  async getTripBudget(tripId, userId) {
    const trip = await this.getTripById(tripId, userId);

    const result = await query(
      `SELECT 
        ts.stop_id,
        c.city_name,
        ts.arrival_date,
        ts.departure_date,
        COALESCE(ts.accommodation_cost, 0) as accommodation_cost,
        COALESCE(ts.transportation_cost, 0) as transportation_cost,
        COALESCE(SUM(sa.actual_cost), 0) as activities_cost,
        COALESCE(ts.accommodation_cost, 0) + COALESCE(ts.transportation_cost, 0) + COALESCE(SUM(sa.actual_cost), 0) as total_cost
       FROM trip_stops ts
       JOIN cities c ON ts.city_id = c.city_id
       LEFT JOIN stop_activities sa ON ts.stop_id = sa.stop_id
       WHERE ts.trip_id = $1
       GROUP BY ts.stop_id, c.city_name, ts.arrival_date, ts.departure_date, ts.accommodation_cost, ts.transportation_cost
       ORDER BY ts.stop_order`,
      [tripId]
    );

    const breakdown = result.rows;
    const totalAccommodation = breakdown.reduce((sum, stop) => sum + parseFloat(stop.accommodation_cost), 0);
    const totalTransportation = breakdown.reduce((sum, stop) => sum + parseFloat(stop.transportation_cost), 0);
    const totalActivities = breakdown.reduce((sum, stop) => sum + parseFloat(stop.activities_cost), 0);
    const grandTotal = totalAccommodation + totalTransportation + totalActivities;

    const tripDays = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)) + 1;

    return {
      trip_id: tripId,
      currency: trip.currency,
      summary: {
        accommodation: totalAccommodation,
        transportation: totalTransportation,
        activities: totalActivities,
        total: grandTotal,
        average_per_day: tripDays > 0 ? grandTotal / tripDays : 0,
      },
      breakdown,
    };
  }
}

module.exports = new TripService();
