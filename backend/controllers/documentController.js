const DocumentSubmission = require('../models/documentSubmissionModel');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const nodemailer = require('nodemailer'); // Add nodemailer

// Save data to CSV
const saveToCSV = (data) => {
    const csvFilePath = path.join(__dirname, '../../data/documentdetails.csv');
    const csvWriterInstance = csvWriter({
        path: csvFilePath,
        header: [
            { id: 'name', title: 'Name' },
            { id: 'email', title: 'Email' },
            { id: 'phone', title: 'Phone' },
            { id: 'title', title: 'Title' },
            { id: 'description', title: 'Description' },
            { id: 'author', title: 'Author' },
            { id: 'publishingOrganization', title: 'Publishing Organization' },
            { id: 'organizationWebsite', title: 'Organization Website' },
            { id: 'yearPublished', title: 'Year Published' },
            { id: 'documentSource', title: 'Document Source' },
            { id: 'documentPath', title: 'Document Path' }
        ],
        append: true
    });

    csvWriterInstance.writeRecords([data])
        .then(() => console.log('CSV file was updated.'));
};

// Save data to JSON
const saveToJSON = (data) => {
    const jsonFilePath = path.join(__dirname, '../../data/documentdetails.json');
    fs.readFile(jsonFilePath, (err, jsonData) => {
        let jsonArr = [];
        if (err) {
            if (err.code === 'ENOENT') {
                jsonArr = [];
            } else {
                throw err;
            }
        } else {
            try {
                jsonArr = JSON.parse(jsonData);
            } catch (parseError) {
                console.error('Failed to parse JSON:', parseError);
                jsonArr = [];
            }
        }

        jsonArr.push(data);

        fs.writeFile(jsonFilePath, JSON.stringify(jsonArr, null, 4), (err) => {
            if (err) throw err;
            console.log('JSON file was updated.');
        });
    });
};

// Function to send confirmation email with details and attached document
const sendConfirmationEmail = (email, documentDetails, attachmentPath) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tanyajswl21@gmail.com', // Replace with your email
            pass: 'krbt wmrv vuca iizd'      // Replace with your app password
        }
    });

    const mailOptions = {
        from: 'tanyajswl21@gmail.com',
        to: email,
        subject: 'Document Submission Confirmation',
        html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">Document Submission Confirmation</h1>
                </div>
                <div style="padding: 20px;">
                    <p style="font-size: 16px; color: #333;">Dear <strong>${documentDetails.name}</strong>,</p>
                    <p style="font-size: 16px; color: #333;">Thank you for submitting your document. Here are the details of your submission:</p>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Title:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${documentDetails.title}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Description:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${documentDetails.description}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Author:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${documentDetails.author}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Publishing Organization:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${documentDetails.publishingOrganization}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Organization Website:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;"><a href="${documentDetails.organizationWebsite}" style="color: #4CAF50; text-decoration: none;">${documentDetails.organizationWebsite}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Year Published:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${documentDetails.yearPublished}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Document Source:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${documentDetails.documentSource}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Document Path:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${documentDetails.documentPath}</td>
                        </tr>
                    </table>

                    <p style="font-size: 16px; color: #333;">If you have any further questions or need to update your submission, please feel free to contact us.</p>
                    <p style="font-size: 16px; color: #333;">Best regards,<br>Document Submission Team</p>
                </div>
                <div style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #777;">
                    <p style="font-size: 12px;">This is an automated email, please do not reply.</p>
                </div>
            </div>
        </div>
    `,
        attachments: attachmentPath ? [
            {
                filename: path.basename(attachmentPath),
                path: path.join(__dirname, '../../uploads/', path.basename(attachmentPath)) // Path to the attached file
            }
        ] : []
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

// Create a new record and send email with details and attachment
exports.createRecord = (req, res) => {
    const { name, email, phone, title, description, author, publishingOrganization, organizationWebsite, yearPublished, documentSource } = req.body;
    let documentPath = '';

    // Handle document upload
    if (documentSource === 'your computer') {
        const file = req.files.document;
        const uploadPath = `/uploads/${file.name}`; // Relative path for serving via HTTP
        const absoluteUploadPath = path.join(__dirname, '../../uploads/', file.name);
        documentPath = uploadPath;

        file.mv(absoluteUploadPath, (err) => {
            if (err) return res.status(500).send(err);

            // Save the record after the file has been successfully uploaded
            const newRecord = new DocumentSubmission({
                name, email, phone, title, description, author, publishingOrganization, organizationWebsite, yearPublished, documentSource, documentPath
            });

            newRecord.save()
                .then((record) => {
                    saveToCSV(record.toObject());
                    saveToJSON(record.toObject());

                    // Send confirmation email with details and attachment
                    sendConfirmationEmail(email, record.toObject(), absoluteUploadPath);

                    res.status(200).json({ message: 'Your document was submitted successfully!' });
                })
                .catch((err) => res.status(500).send(err));
        });
    } else {
        // If the document is not from the user's computer, save the record directly
        documentPath = req.body.websiteLink;

        const newRecord = new DocumentSubmission({
            name, email, phone, title, description, author, publishingOrganization, organizationWebsite, yearPublished, documentSource, documentPath
        });

        newRecord.save()
            .then((record) => {
                saveToCSV(record.toObject());
                saveToJSON(record.toObject());

                // Send confirmation email with details (no attachment in this case)
                sendConfirmationEmail(email, record.toObject(), null);

                res.status(200).json({ message: 'Your document was submitted successfully!' });
            })
            .catch((err) => res.status(500).send(err));
    }
};

exports.getRecordById = (req, res) => {
    DocumentSubmission.findById(req.params.id)
        .then(record => res.json(record))
        .catch(err => res.status(404).send(err));
};

// Get all documents or filter by name
exports.getDocuments = (req, res) => {
    const { name } = req.query;

    let query = {};
    if (name) {
        query.name = { $regex: new RegExp(name, 'i') };
    }

    DocumentSubmission.find(query)
        .then((documents) => res.json(documents))
        .catch((err) => res.status(500).send(err));
};
