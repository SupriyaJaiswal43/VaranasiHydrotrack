const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    dateOfIncident: { type: Date, required: true },
    timeOfIncident: { type: String, required: true },
    locationOfIncident: { type: String, required: true },
    waterbody: { type: String, required: true },
    activityConcern: { type: String, required: true },
    additionalInformation: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    incidentPhotoPath: { type: String }
});

module.exports = mongoose.model('Incident', incidentSchema);
