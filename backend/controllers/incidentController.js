const Incident = require('../models/incidentModel');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const nodemailer = require('nodemailer');

const saveToCSV = (data) => {
    const csvFilePath = path.join(__dirname, '../../data/incidents_data.csv');
    const csvWriterInstance = csvWriter({
        path: csvFilePath,
        header: [
            { id: 'dateOfIncident', title: 'Date of Incident' },
            { id: 'timeOfIncident', title: 'Time of Incident' },
            { id: 'locationOfIncident', title: 'Location of Incident' },
            { id: 'waterbody', title: 'Waterbody' },
            { id: 'activityConcern', title: 'Activity/Concern' },
            { id: 'additionalInformation', title: 'Additional Information' },
            { id: 'name', title: 'Name' },
            { id: 'email', title: 'Email' },
            { id: 'phone', title: 'Phone' },
            { id: 'lat', title: 'Latitude' },
            { id: 'lng', title: 'Longitude' },
            { id: 'address', title: 'Address' },
            { id: 'incidentPhotoPath', title: 'Incident Photo Path' }
        ],
        append: true
    });

    csvWriterInstance.writeRecords([data])
        .then(() => console.log('CSV file was updated.'));
};

const saveToJSON = (data) => {
    const jsonFilePath = path.join(__dirname, '../../data/incidents_data.json');
    fs.readFile(jsonFilePath, (err, jsonData) => {
        if (err) throw err;

        const jsonArr = JSON.parse(jsonData);
        jsonArr.push(data);

        fs.writeFile(jsonFilePath, JSON.stringify(jsonArr, null, 4), (err) => {
            if (err) throw err;
            console.log('JSON file was updated.');
        });
    });
};

// Function to send email with attachment
const sendConfirmationEmail = (email, incidentDetails, attachmentPath) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tanyajswl21@gmail.com',
            pass: 'krbt wmrv vuca iizd' // Replace with your app password
        }
    });

   
    const mailOptions = {
        from: 'tanyajswl21@gmail.com',
        to: email,
        subject: 'Incident Report Confirmation',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #4CAF50; text-align: center;">Incident Report Confirmation</h2>
                    <p>Dear <strong>${incidentDetails.name}</strong>,</p>
                    <p>Thank you for submitting the incident report. We have received the following details:</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr>
                            <td style="padding: 10px; border: 1px solid #dddddd;"><strong>Date of Incident</strong></td>
                            <td style="padding: 10px; border: 1px solid #dddddd;">${incidentDetails.dateOfIncident}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #dddddd;"><strong>Time of Incident</strong></td>
                            <td style="padding: 10px; border: 1px solid #dddddd;">${incidentDetails.timeOfIncident}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #dddddd;"><strong>Location</strong></td>
                            <td style="padding: 10px; border: 1px solid #dddddd;">${incidentDetails.locationOfIncident}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #dddddd;"><strong>Waterbody</strong></td>
                            <td style="padding: 10px; border: 1px solid #dddddd;">${incidentDetails.waterbody}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #dddddd;"><strong>Activity/Concern</strong></td>
                            <td style="padding: 10px; border: 1px solid #dddddd;">${incidentDetails.activityConcern}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #dddddd;"><strong>Additional Information</strong></td>
                            <td style="padding: 10px; border: 1px solid #dddddd;">${incidentDetails.additionalInformation}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #dddddd;"><strong>Latitude</strong></td>
                            <td style="padding: 10px; border: 1px solid #dddddd;">${incidentDetails.lat}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #dddddd;"><strong>Longitude</strong></td>
                            <td style="padding: 10px; border: 1px solid #dddddd;">${incidentDetails.lng}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #dddddd;"><strong>Address</strong></td>
                            <td style="padding: 10px; border: 1px solid #dddddd;">${incidentDetails.address}</td>
                        </tr>
                    </table>
                    <p>The incident photo has been attached to this email for your reference.</p>
                    <p>If you have any further questions or need to update your submission, please feel free to contact us.</p>
                    <p style="color: #888888; font-size: 12px; text-align: center;">Best regards,<br>Environmental Monitoring Team</p>
                </div>
            </div>
        `,
        attachments: [
            {
                filename: path.basename(attachmentPath),
                path: path.join(__dirname, '../../uploads/', path.basename(attachmentPath)) // Path to the attachment
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

exports.createRecord = (req, res) => {
    const { dateOfIncident, timeOfIncident, locationOfIncident, waterbody, activityConcern, additionalInformation, name, email, phone, lat, lng, address } = req.body;
    let incidentPhotoPath = '';

    if (req.files && req.files.incidentPhoto) {
        const file = req.files.incidentPhoto;
        const uploadPath = path.join(__dirname, '../../uploads/', file.name);
        
        // Save the relative path to serve it via the server
        incidentPhotoPath = `/uploads/${file.name}`;
        
        // Move the uploaded file to the specified directory
        file.mv(uploadPath, (err) => {
            if (err) return res.status(500).send(err);
        });
    }

    const newRecord = new Incident({
        dateOfIncident, 
        timeOfIncident, 
        locationOfIncident, 
        waterbody, 
        activityConcern, 
        additionalInformation, 
        name, 
        email, 
        phone, 
        lat, 
        lng, 
        address, 
        incidentPhotoPath // Store the correct relative path
    });

    newRecord.save()
        .then((record) => {
            saveToCSV(record.toObject());
            saveToJSON(record.toObject());
            
            // Send email to the user with the form data and attached photo
            sendConfirmationEmail(email, record.toObject(), incidentPhotoPath);

            res.status(201).send('Record created successfully and confirmation email sent.');
        })
        .catch((err) => res.status(500).send(err));
};

// exports.createRecord = (req, res) => {
//     const { dateOfIncident, timeOfIncident, locationOfIncident, waterbody, activityConcern, additionalInformation, name, email, phone, lat, lng, address } = req.body;
//     let incidentPhotoPath = '';

//     if (req.files && req.files.incidentPhoto) {
//         const file = req.files.incidentPhoto;
//         const uploadPath = path.join(__dirname, '../../uploads/', file.name);
//         incidentPhotoPath = uploadPath;
//         file.mv(uploadPath, (err) => {
//             if (err) return res.status(500).send(err);
//         });
//     }

//     const newRecord = new Incident({
//         dateOfIncident, timeOfIncident, locationOfIncident, waterbody, activityConcern, additionalInformation, name, email, phone, lat, lng, address, incidentPhotoPath
//     });

//     newRecord.save()
//         .then((record) => {
//             saveToCSV(record.toObject());
//             saveToJSON(record.toObject());
//             res.status(201).send('Record created successfully');
//         })
//         .catch((err) => res.status(500).send(err));
// };
exports.getIncidents = (req, res) => {
    const { name } = req.query;

    let query = {};
    if (name) {
        query.name = { $regex: new RegExp(name, 'i') };
    }

    Incident.find(query)
        .then((incidents) => {
            res.json(incidents);
        })
        .catch((err) => res.status(500).send(err));
};
//new
// incidentController.js

// Route to get analytics data grouped by month
exports.getIncidentAnalytics = (req, res) => {
    Incident.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$dateOfIncident" },
                    month: { $month: "$dateOfIncident" }
                },
                totalIncidents: { $sum: 1 },
                activityConcerns: { $push: "$activityConcern" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])
    .then((analytics) => res.json(analytics))
    .catch((err) => res.status(500).send(err));
};
