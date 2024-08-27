// backend/models/waterQualityModel.js
const mongoose = require('mongoose');

const waterQualitySchema = new mongoose.Schema({
    state: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    pH: { type: Number, required: true },
    TDS: { type: Number, required: true },
    Turbidity: { type: Number, required: true },
    Iron: { type: Number, required: true },
    Calcium: { type: Number, required: true },
    Magnesium: { type: Number, required: true },
    Nitrate: { type: Number, required: true },
    Fluoride: { type: Number, required: true },
    Chloride: { type: Number, required: true },
    Sulfate: { type: Number, required: true },
    Alkalinity: { type: Number, required: true },
    Hardness: { type: Number, required: true },
    timePeriod: { type: Date, required: true },
    WQI: { type: Number } // Calculated field
});

module.exports = mongoose.model('WaterQuality', waterQualitySchema);
