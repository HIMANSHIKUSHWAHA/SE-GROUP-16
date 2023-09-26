const express = require('express');
const app = express();
const PORT = 5000;
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Middleware to parse JSON requests
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

//error handler to be placed last
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});