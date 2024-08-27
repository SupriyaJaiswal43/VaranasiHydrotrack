const mongoose = require('mongoose');

const documentSubmissionSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    title: String,
    description: String,
    author: String,
    publishingOrganization: String,
    organizationWebsite: String,
    yearPublished: Number,
    documentSource: String,
    documentPath: String
});

module.exports = mongoose.model('DocumentSubmission', documentSubmissionSchema);
