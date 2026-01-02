const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.originalUrl} [DB State: ${mongoose.connection.readyState}]`);
    next();
});

// Routes
const matchRoutes = require('./routes/matchRoutes');
const donorAdminRoutes = require('./routes/donorRoutes'); // Will create next
const recipientAdminRoutes = require('./routes/recipientRoutes'); // Will create next
const allocationRoutes = require('./routes/allocationRoutes');

app.use('/api/matches', matchRoutes); // Routes for matching logic
app.use('/api/donors', donorAdminRoutes);
app.use('/api/recipients', recipientAdminRoutes);
app.use('/api/allocation', allocationRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ MongoDB Connected');

        // Start Server ONLY after DB connection succeeds
        app.listen(PORT, () => {
            console.log(`🚀 Backend Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1); // Exit if DB connection fails
    });
