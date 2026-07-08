const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./authRoutes');
const offerRoutes = require('./offerRoutes');
const transactionRoutes = require('./transactionRoutes');
const userRoutes = require('./userRoutes');
const ratingRoutes = require('./ratingRoutes');
const notificationRoutes = require('./notificationRoutes');

// Use routes
router.use('/auth', authRoutes);
router.use('/offers', offerRoutes);
router.use('/transactions', transactionRoutes);
router.use('/users', userRoutes);
router.use('/ratings', ratingRoutes);
router.use('/notifications', notificationRoutes);

// Health check route (optional, but good to have)
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        routes: ['auth', 'offers', 'transactions', 'users', 'ratings', 'notifications']
    });
});

module.exports = router;
