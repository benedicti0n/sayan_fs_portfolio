const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const path = require('path');
const fs = require('fs');

// Ensure data directory exists for OTP storage
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Created data directory for OTP storage');
}

// Load environment variables from .env file
dotenv.config();

// Debug environment variables
console.log('Environment variables loaded:', {
    port: process.env.PORT,
    mongoUri: process.env.MONGODB_URI ? 'MongoDB URI exists' : 'MongoDB URI missing',
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS ? 'Email password exists' : 'Email password missing',
    notificationEmail: process.env.NOTIFICATION_EMAIL,
    notificationPass: process.env.NOTIFICATION_EMAIL_PASS ? 'Notification password exists' : 'Notification password missing'
});

const app = express();

// Enable CORS with specific configuration for local testing
// This allows requests from any origin during development
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'DELETE'], // Allow necessary methods including DELETE
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes); // Mount admin routes

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Connect to MongoDB without dropping collections
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // No longer dropping collections on startup to preserve data
        
        // Start the server after successful database connection
        const PORT = process.env.PORT || 3002;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit with error code
    });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    // Keep the process running for development
    // In production, you might want to exit and let a process manager restart
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled promise rejection:', reason);
    // Keep the process running for development
});