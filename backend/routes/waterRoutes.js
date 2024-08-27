const express = require('express');
const router = express.Router();
const waterController = require('../controllers/waterController');

// API route to create a record
router.post('/add', waterController.createWaterRecord);

// API route to get all records
router.get('/records', waterController.getAllRecords);

module.exports = router;
