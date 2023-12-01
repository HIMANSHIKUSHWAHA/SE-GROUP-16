require('dotenv').config();
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');


const connectDB = async () => {
    const conn = await mongoose.connect("mongodb+srv://root:root@merntut.fxy1yel.mongodb.net/practice_collection?retryWrites=true&w=majority",
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