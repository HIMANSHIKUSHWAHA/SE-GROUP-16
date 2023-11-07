require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const twoFARoutes = require('./routes/2faRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes')
const searchRoutes = require('./routes/searchRoutes')
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');

console.log('Started backend server');

// Connect to mongoose
connectDB();

// Enable CORS for all routes
app.use("*", cors());
app.use(express.json());
app.use(cookieParser());

// Session Middleware Initialization with secure cookie settings
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',  // Ensure secure cookies in production
        httpOnly: true,
        sameSite: 'Strict'
    }
}));

// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth/2fa', twoFARoutes);
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/search', searchRoutes);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
// Error handler to be placed last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
