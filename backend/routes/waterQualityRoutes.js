const express = require('express');
const router = express.Router();
const waterQualityController = require('../controllers/waterQualityController');

router.post('/water-quality', waterQualityController.createWaterQualityData);
router.get('/water-quality', waterQualityController.getWaterQualityData);
router.get('/calculate-wqi', waterQualityController.calculateAndExportWQI);

router.get('/water-quality', waterQualityController.getAllWaterQualityData);
router.get('/data-summary', waterQualityController.getDataSummary);
router.get('/years', waterQualityController.getYears);
router.get('/data/:year', waterQualityController.getDataByYear);
router.get('/locations', waterQualityController.getDistinctLocations); // New route
router.get('/location/:location', waterQualityController.getDataByLocation);
router.get('/location/:location', waterQualityController.getDataByLocation); // New route for location-specific data
router.get('/water-quality', waterQualityController.getWaterQualityData);
router.get('/water-quality/dropdowns', waterQualityController.getDropdownData);

module.exports = router;
