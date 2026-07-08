const Rating = require('../models/Rating');
const Transaction = require('../models/Transaction');
const { logger } = require('../utils/logger');
const { validationResult } = require('express-validator');

exports.createRating = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { transaction_id, rated_user_id, rating, comment } = req.body;
        const rater_id = req.userId;

        // Check if transaction exists and is completed
        const transaction = await Transaction.findById(transaction_id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (transaction.status !== 'completed') {
            return res.status(400).json({ error: 'Transaction must be completed before rating' });
        }

        // Check if user is part of the transaction
        if (transaction.requester_id !== rater_id && transaction.provider_id !== rater_id) {
            return res.status(403).json({ error: 'You are not part of this transaction' });
        }

        // Can't rate yourself
        if (rater_id === rated_user_id) {
            return res.status(400).json({ error: 'You cannot rate yourself' });
        }

        // Check if already rated
        try {
            const newRating = await Rating.create({
                transaction_id,
                rater_id,
                rated_user_id,
                rating,
                comment
            });

            logger.info(Rating created for transaction  by user );
            
            res.status(201).json({
                success: true,
                rating: newRating
            });
        } catch (error) {
            if (error.message === 'You have already rated this transaction') {
                return res.status(400).json({ error: error.message });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Create rating error:', error);
        res.status(500).json({ error: 'Failed to create rating' });
    }
};

exports.getUserRatings = async (req, res) => {
    try {
        const userId = req.params.userId || req.userId;
        const ratings = await Rating.findByUser(userId);
        
        res.json({
            success: true,
            count: ratings.length,
            ratings
        });
    } catch (error) {
        logger.error('Get user ratings error:', error);
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
};

exports.getTransactionRatings = async (req, res) => {
    try {
        const transactionId = req.params.transactionId;
        const ratings = await Rating.findByTransaction(transactionId);
        
        res.json({
            success: true,
            count: ratings.length,
            ratings
        });
    } catch (error) {
        logger.error('Get transaction ratings error:', error);
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
};

exports.getRatingStats = async (req, res) => {
    try {
        const userId = req.params.userId || req.userId;
        const stats = await Rating.getAverage(userId);
        
        res.json({
            success: true,
            stats: {
                average: parseFloat(stats.average),
                total: parseInt(stats.total)
            }
        });
    } catch (error) {
        logger.error('Get rating stats error:', error);
        res.status(500).json({ error: 'Failed to fetch rating stats' });
    }
};

exports.deleteRating = async (req, res) => {
    try {
        const ratingId = req.params.id;
        const deleted = await Rating.delete(ratingId, req.userId);
        
        if (!deleted) {
            return res.status(404).json({ error: 'Rating not found or not authorized' });
        }

        logger.info(Rating  deleted by user );
        
        res.json({
            success: true,
            message: 'Rating deleted successfully'
        });
    } catch (error) {
        logger.error('Delete rating error:', error);
        res.status(500).json({ error: 'Failed to delete rating' });
    }
};
