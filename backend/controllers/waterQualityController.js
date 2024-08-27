const WaterQuality = require('../models/waterQualityModel');
const { parse: json2csv } = require('json2csv');
const fs = require('fs');
const path = require('path');
const { countReset } = require('console');

exports.createWaterQualityData = async (req, res) => {
    try {
        console.log('Received data:', req.body);
        const waterQualityData = new WaterQuality(req.body);
        await waterQualityData.save();
        console.log('Data saved successfully:', waterQualityData);

        await exports.calculateAndExportWQI();

        res.status(201).json({ message: 'Data submitted successfully!', data: waterQualityData });
    } catch (err) {
        console.error('Error saving data:', err.message);
        res.status(400).json({ message: err.message });
    }
};

exports.getWaterQualityData = async (req, res) => {
    try {
        const waterQualityData = await WaterQuality.find();
        res.status(200).json(waterQualityData);
    } catch (err) {
        console.error('Error retrieving data:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getYears = async (req, res) => {
    try {
        const years = await WaterQuality.distinct('timePeriod');
        const formattedYears = years.map(date => new Date(date).getFullYear());
        res.status(200).json([...new Set(formattedYears)]);
    } catch (err) {
        console.error('Error retrieving years:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getDataByYear = async (req, res) => {
    try {
        const year = req.params.year;
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year}-12-31`);
        const data = await WaterQuality.find({
            timePeriod: {
                $gte: start,
                $lte: end
            }
        });
        res.status(200).json(data);
    } catch (err) {
        console.error('Error retrieving data for year:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const standardValues = {
    pH: 8.5,
    TDS: 500,
    Turbidity: 5,
    Iron: 0.3,
    Calcium: 75,
    Magnesium: 30,
    Nitrate: 45,
    Fluoride: 1.5,
    Chloride: 250,
    Sulfate: 250,
    Alkalinity: 200,
    Hardness: 300
};

const idealValues = {
    pH: 7,
    TDS: 0,
    Turbidity: 0,
    Iron: 0,
    Calcium: 0,
    Magnesium: 0,
    Nitrate: 0,
    Fluoride: 0,
    Chloride: 0,
    Sulfate: 0,
    Alkalinity: 0,
    Hardness: 0
};

const unitWeights = {};
for (let param in standardValues) {
    unitWeights[param] = 1 / standardValues[param];
}

const calculateWQI = (data) => {
    let totalSubIndex = 0;
    let totalWeight = 0;
    for (let param in data) {
        if (param in unitWeights && param in idealValues) {
            let qualityRating = ((data[param] - idealValues[param]) / (standardValues[param] - idealValues[param])) * 100;
            let subIndex = unitWeights[param] * qualityRating;
            totalSubIndex += subIndex;
            totalWeight += unitWeights[param];
        }
    }
    return totalSubIndex / totalWeight;
};

exports.calculateAndExportWQI = async () => {
    try {
        const waterQualityData = await WaterQuality.find();
        waterQualityData.forEach(data => {
            data.WQI = calculateWQI(data.toObject());
            data.save();
        });

        const plainWaterQualityData = waterQualityData.map(data => data.toObject());

        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        const csv = json2csv(plainWaterQualityData);
        const csvFilePath = path.join(dataDir, 'water_quality_data.csv');
        fs.writeFileSync(csvFilePath, csv);
        console.log('Data exported to CSV successfully at:', csvFilePath);

        const jsonFilePath = path.join(dataDir, 'water_quality_data.json');
        fs.writeFileSync(jsonFilePath, JSON.stringify(plainWaterQualityData, null, 2));
        console.log('Data exported to JSON successfully at:', jsonFilePath);
    } catch (err) {
        console.error('Error calculating and exporting WQI:', err.message);
    }
};

exports.getAllWaterQualityData = async (req, res) => {
    try {
        const data = await WaterQuality.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDataSummary = async (req, res) => {
    try {
        const data = await WaterQuality.aggregate([
            {
                $group: {
                    _id: "$location",
                    pH: { $avg: "$pH" },
                    TDS: { $avg: "$TDS" },
                    Turbidity: { $avg: "$Turbidity" },
                    Iron: { $avg: "$Iron" },
                    Calcium: { $avg: "$Calcium" },
                    Magnesium: { $avg: "$Magnesium" },
                    Nitrate: { $avg: "$Nitrate" },
                    Fluoride: { $avg: "$Fluoride" },
                    Chloride: { $avg: "$Chloride" },
                    Sulfate: { $avg: "$Sulfate" },
                    Alkalinity: { $avg: "$Alkalinity" },
                    Hardness: { $avg: "$Hardness" },
                    TimePeriod: { $max: "$TimePeriod" }
                }
            }
        ]);

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Get distinct locations
exports.getDistinctLocations = async (req, res) => {
    try {
        const locations = await WaterQuality.distinct('location');
        res.status(200).json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get data for a specific location
exports.getDataByLocation = async (req, res) => {
    try {
        const location = req.params.location;
        const data = await WaterQuality.find({ location: location });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get data for a specific location
exports.getDataByLocation = async (req, res) => {
    try {
        const location = req.params.location;
        const data = await WaterQuality.find({ location: location });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//new
// exports.getDropdownData = async (req, res) => {
//     try {
//         const locations = await WaterQuality.distinct('location');
//         const years = await WaterQuality.distinct('timePeriod');
//         const formattedYears = [...new Set(years.map(date => new Date(date).getFullYear()))].sort((a, b) => a - b);
//         res.status(200).json({ locations, years: formattedYears });
//     } catch (err) {
//         console.error('Error retrieving dropdown data:', err.message);
//         res.status(500).json({ message: err.message });
//     }
// };
exports.getDropdownData = async (req, res) => {
    try {
        // Get distinct locations
        const locations = await WaterQuality.distinct('location');
        // Get distinct time periods
        const years = await WaterQuality.distinct('timePeriod');
        // Get distinct countries
        const countries = await WaterQuality.distinct('country');
        // Get distinct states
        const states = await WaterQuality.distinct('state');
        // Get distinct cities
        const cities = await WaterQuality.distinct('city');

        // Ensure that the results are arrays before using map()
        if (!Array.isArray(locations) || !Array.isArray(countries) || !Array.isArray(states) || !Array.isArray(cities) || !Array.isArray(years)) {
            console.error('Expected arrays for dropdown values.');
            return res.status(500).json({ message: 'Error retrieving dropdown data.' });
        }

        // Format years to extract only the year part
        const formattedYears = [...new Set(years.map(date => new Date(date).getFullYear()))].sort((a, b) => a - b);

        // Send the response
        res.status(200).json({ locations, years: formattedYears, countries, states, cities });
    } catch (err) {
        console.error('Error retrieving dropdown data:', err.message);
        res.status(500).json({ message: err.message });
    }
};



exports.getYears = async (req, res) => {
    try {
        const years = await WaterQuality.distinct('timePeriod');
        const formattedYears = [...new Set(years.map(date => new Date(date).getFullYear()))];
        res.status(200).json(formattedYears.sort((a, b) => a - b)); // Sort years in ascending order
    } catch (err) {
        console.error('Error retrieving years:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getWaterQualityData = async (req, res) => {
    try {
        const { location, timePeriod } = req.query;
        const query = {};
        if (location) query.location = new RegExp(location, 'i');
        if (timePeriod) query.timePeriod = timePeriod;

        const waterQualityData = await WaterQuality.find(query).sort({ timePeriod: 1 }); // Sort by year in ascending order
        res.status(200).json(waterQualityData);
    } catch (err) {
        console.error('Error retrieving data:', err.message);
        res.status(500).json({ message: err.message });
    }
};
exports.getData = async (req, res) => {
    try {
        const { location, timePeriod } = req.query;
        let query = {};

        if (location) query.location = location;
        if (timePeriod) query.timePeriod = { $regex: new RegExp(`^${timePeriod}`) }; // Adjust to match year

        const data = await WaterQuality.find(query).sort({ timePeriod: -1 }); // Sort by timePeriod in descending order

        res.status(200).json(data);
    } catch (err) {
        console.error('Error retrieving data:', err.message);
        res.status(500).json({ message: err.message });
    }
};
