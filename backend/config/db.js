require('dotenv').config();
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');


const connectDB = async () => {
    const conn = await mongoose.connect("mongodb+srv://admin:admin@p465.4cmbcpe.mongodb.net/",
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