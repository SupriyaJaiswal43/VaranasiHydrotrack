const Water = require('../models/waterModel');

// Create new water quality record
exports.createWaterRecord = async (req, res) => {
    const { block, hydrographStation, longitude, latitude, preMonsoon, postMonsoon, fluctuation } = req.body;

    try {
        const waterRecord = new Water({
            block,
            hydrographStation,
            longitude,
            latitude,
            preMonsoon,
            postMonsoon,
            fluctuation,
        });

        await waterRecord.save();
        res.status(201).json({ message: 'Record added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all records
exports.getAllRecords = async (req, res) => {
    try {
        const records = await Water.find();
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
