require('dotenv').config();
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');


const connectDB = async () => {
    const conn = await mongoose.connect("mongodb://localhost:27017",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .catch(error => {
            throw new AppError(error, 500);
        });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

};

module.exports = connectDB;