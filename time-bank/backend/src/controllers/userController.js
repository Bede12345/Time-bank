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

exports.updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { full_name, bio, skills } = req.body;
        const userId = req.userId;

        const result = await query(
            `UPDATE users 
             SET full_name = COALESCE($1, full_name),
                 bio = COALESCE($2, bio),
                 skills = COALESCE($3, skills),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING id, username, email, full_name, bio, skills, time_credits, rating_average`,
            [full_name, bio, skills, userId]
        );

        