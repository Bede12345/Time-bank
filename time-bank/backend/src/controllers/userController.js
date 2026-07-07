const User = require('../models/User');
const { logger } = require('../utils/logger');
const { validationResult } = require('express-validator');

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const stats = await User.getStats(userId);
        
        res.json({
            success: true,
            user: {
                ...user,
                stats
            }
        });
    } catch (error) {
        logger.error('Get user profile error:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

