const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// Define routes for document submission
router.post('/create', documentController.createRecord);
router.get('/:id', documentController.getRecordById);
// Route to get documents, optionally filtered by name
router.get('/', documentController.getDocuments);
module.exports = router;
