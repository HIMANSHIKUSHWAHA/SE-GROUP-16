const express = require('express');
const app = express();
const PORT = 5000;
const authRoutes = require('./routes/authRoutes');

// Middleware to parse JSON requests
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});