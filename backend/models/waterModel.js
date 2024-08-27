const mongoose = require('mongoose');

const WaterSchema = new mongoose.Schema({
    block: String,
    hydrographStation: String,
    longitude: Number,
    latitude: Number,
    preMonsoon: Number,
    postMonsoon: Number,
    fluctuation: Number,
});

const Water = mongoose.model('Water', WaterSchema);

module.exports = Water;
