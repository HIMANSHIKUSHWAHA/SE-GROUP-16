const mongoose = require('mongoose');

// Define the schema for sleep details with default values
const SleepSchema = new mongoose.Schema({
    startTime: { type: String, default: "11:00 PM" },
    endTime: { type: String, default: "7:00 AM" },
    totalHours: { type: Number, default: 8 },
    isDefault: { type: Boolean, default: false },
});

const SleepPlan = mongoose.model('SleepPlan', SleepSchema);
module.exports = SleepPlan;
