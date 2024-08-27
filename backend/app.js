// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const waterQualityRoutes = require('./routes/waterQualityRoutes');
const fileUpload = require('express-fileupload');
const path = require('path'); 
const incidentRoutes = require('./routes/incidentRoutes');
const documentRoutes = require('./routes/documentRoutes'); // Make sure this is correct
const waterRoutes = require('./routes/waterRoutes');


const app = express();

// Connect to MongoDB
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Serve static files from 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api', waterQualityRoutes);

// Make sure documentRoutes and incidentRoutes are correctly required
 app.use('/api/documents', documentRoutes);
 app.use('/api/incidents', incidentRoutes);
 app.use('/api/water', waterRoutes);
 // API Routes




// Start Servera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
