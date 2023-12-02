const express = require('express');
const router = express.Router();
const Professional = require('../models/Professional'); // Adjust the path as needed
/*
Request Queue

Proffestional Trainer Side id(9012)
VideoId  DateRequested TimeRequested Status
re34r3r  12/12/2020      12:00       Pending

requestQueue = [{
    videoId: "re34r3r",
    dateRequested: "12/12/2020",
    timeRequested: "12:00",
    status: "Pending"
}]

admin approves the request
update adminsRequestQueue in mongodb
update requestQueue in mongodb

first update the adminsRequestQueue in mongodb status to approved

For updating proffestional side

fetch adminsRequestQueue from mongodb
find your id in the adminsRequestQueue
check if status is approved
requestQueue update that videoId status to approved
*/

// Recieving Requests from the proffestional trainer
// Endpoint to handle admin requests for a specific action
router.post("/request-admin", async (req, res) => {
    // Extract data from the request body
    const { professionalId, videoRequest, date, time, status, videoId } = req.body;

    try {
        // Update the Professional document with new request data
        await Professional.findOneAndUpdate(
            { _id: professionalId },
            { $push: { requestQueue: { videoId, dateRequested: date, timeRequested: time, status, videoRequest } } },
            { new: true } // Return the updated document
        );

        res.status(200).send("Request successfully updated.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while updating request.");
    }
});

// Endpoint to retrieve all requests
router.get("/retrieve-all-requests", async (req, res) => {
    try {
        const data = await Professional.find({ requestQueue: { $exists: true, $ne: [] } });
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while retrieving requests.");
    }
});

// Endpoint to approve a request
router.post("/approve-request", async (req, res) => {
    const { videoId, professionalId } = req.body;

    try {
        await Professional.findOneAndUpdate(
            { _id: professionalId, "requestQueue.videoId": videoId },
            { $set: { "requestQueue.$.status": "Approved" } },
            { arrayFilters: [{ "element.videoId": videoId }] }
        );

        res.status(200).send("Request approved.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while approving request.");
    }
});

// Endpoint to decline a request
router.post("/decline-request", async (req, res) => {
    const { videoId, professionalId } = req.body;

    try {
        await Professional.findOneAndUpdate(
            { _id: professionalId, "requestQueue.videoId": videoId },
            { $set: { "requestQueue.$.status": "Declined" } },
            { arrayFilters: [{ "element.videoId": videoId }] }
        );

        res.status(200).send("Request declined.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while declining request.");
    }
});

// Endpoint to delete an approved request
router.delete("/delete-approved-request", async (req, res) => {
    const { videoId, professionalId } = req.body;

    try {
        await Professional.findOneAndUpdate(
            { _id: professionalId },
            { $pull: { requestQueue: { videoId: videoId } } }
        );

        res.status(200).send("Approved request deleted.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while deleting request.");
    }
});

module.exports = router;
