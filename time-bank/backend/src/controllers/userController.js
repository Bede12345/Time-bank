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

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        logger.info(`User profile updated: ${userId}`);
        
        res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
        logger.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

exports.getUserOffers = async (req, res) => {
    try {
        const userId = req.params.id || req.userId;
        const offers = await Offer.getUserOffers(userId);
        
        res.json({
            success: true,
            count: offers.length,
            offers
        });
    } catch (error) {
        logger.error('Get user offers error:', error);
        res.status(500).json({ error: 'Failed to fetch user offers' });
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const userId = req.params.id || req.userId;
        const transactions = await Transaction.findByUser(userId);
        
        res.json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        logger.error('Get user transactions error:', error);
        res.status(500).json({ error: 'Failed to fetch user transactions' });
    }
};

exports.getTopUsers = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const result = await query(
            `SELECT id, username, full_name, rating_average, rating_count, time_credits
             FROM users
             WHERE is_active = true
             ORDER BY rating_average DESC, rating_count DESC
             LIMIT $1`,
            [limit]
        );

        res.json({
            success: true,
            count: result.rows.length,
            users: result.rows
        });
    } catch (error) {
        logger.error('Get top users error:', error);
        res.status(500).json({ error: 'Failed to fetch top users' });
    }
};

// Helper function for queries (import this at top)
const { query } = require('../config/database');
const Offer = require('../models/Offer');
const Transaction = require('../models/Transaction');