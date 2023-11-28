const mongoose = require('mongoose');
const getAllVideos = require('../controllers/search/aggregatesController'); // Update with the correct path to your getAllVideos file
require('dotenv').config();
// Set up default mongoose connection
const mongoDB = "mongodb://localhost:27017"; // Replace with your actual MongoDB URL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Mock Express response object
const res = {
    json: (data) => {
        console.log('Data:', data);
        process.exit(0); // Exit the process when data is logged
    },
    status: (statusCode) => {
        console.log(`Status Code: ${statusCode}`);
        return {
            json: (data) => {
                console.log(data);
                process.exit(1); // Exit the process with an error code if there is an error
            }
        };
    }
};

// Execute the function
getAllVideos({}, res);