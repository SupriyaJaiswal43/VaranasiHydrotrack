const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController'); // Correct path to your controller

// Route to create a new incident record
router.post('/create', incidentController.createRecord);

// Route to get incidents, optionally filtered by name
router.get('/', incidentController.getIncidents);
// incidentRoutes.js
router.get('/analytics', incidentController.getIncidentAnalytics);


module.exports = router;
