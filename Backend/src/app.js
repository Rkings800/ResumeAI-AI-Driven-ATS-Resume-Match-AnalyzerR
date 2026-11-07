const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');

const authRoutes = require('./routes/auth.route');
const interviewRoutes = require('./routes/interview.routes');
/**
 * require all routes here
 */


const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/interview', interviewRoutes); // Mount interview routes

// Test Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server Working 🚀'
    });
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Multer error handler (file upload errors)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File is too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    }
    if (err.message === 'Only PDF files are allowed') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next(err);
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;