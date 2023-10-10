require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
//2FA still in progress
const twoFARoutes = require('./routes/2faRoutes');
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');

console.log('Started backend server')


// Connect to mongoose
connectDB();


// Middleware to parse JSON requests
// Enable CORS for all routes
app.use(cors());
app.use(express.json());


// Session Middleware Initialization
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));


// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//Routes
app.use('/api/v1/auth', authRoutes);
// TODO Complete 2FA testing
app.use('/api/v1/auth/2fa', twoFARoutes);


//error handler to be placed last
app.use(errorHandler);


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});