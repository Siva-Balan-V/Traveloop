const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticate, optionalAuth } = require('../middleware/auth');

router.get('/', authenticate, tripController.getUserTrips);
router.post('/', authenticate, tripController.createTrip);
router.get('/shared/:token', optionalAuth, tripController.getSharedTrip);
router.get('/:id', authenticate, tripController.getTripById);
router.put('/:id', authenticate, tripController.updateTrip);
router.delete('/:id', authenticate, tripController.deleteTrip);
router.get('/:id/budget', authenticate, tripController.getTripBudget);
router.post('/:id/share', authenticate, tripController.generateShareToken);
router.get('/:id/stops', authenticate, tripController.getTripStops);
router.post('/:id/stops', authenticate, tripController.addStop);
router.put('/stops/:stopId', authenticate, tripController.updateStop);
router.delete('/stops/:stopId', authenticate, tripController.deleteStop);

router.get('/:id/notes', authenticate, tripController.getNotes);
router.post('/:id/notes', authenticate, tripController.createNote);
router.put('/notes/:noteId', authenticate, tripController.updateNote);
router.delete('/notes/:noteId', authenticate, tripController.deleteNote);

router.get('/:id/packing', authenticate, tripController.getPackingList);
router.post('/:id/packing', authenticate, tripController.addPackingItem);
router.put('/packing/:itemId', authenticate, tripController.updatePackingItem);
router.delete('/packing/:itemId', authenticate, tripController.deletePackingItem);

module.exports = router;
