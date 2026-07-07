const Transaction = require('../models/Transaction');
const Offer = require('../models/Offer');
const User = require('../models/User');
const { logger } = require('../utils/logger');
const { validationResult } = require('express-validator');

exports.createTransaction = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { offer_id, hours_estimated } = req.body;
        const requesterId = req.userId;

        const offer = await Offer.findById(offer_id);
        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        if (offer.user_id === requesterId) {
            return res.status(400).json({ error: 'Cannot request your own offer' });
        }

        if (offer.status !== 'open') {
            return res.status(400).json({ error: 'Offer is no longer available' });
        }

        const credits_held = offer.credits_per_hour * hours_estimated;

        const requester = await User.findById(requesterId);
        if (requester.time_credits < credits_held) {
            return res.status(400).json({ 
                error: 'Insufficient time credits',
                required: credits_held,
                available: requester.time_credits
            });
        }

        const transaction = await Transaction.create({
            offer_id,
            requester_id: requesterId,
            provider_id: offer.user_id,
            credits_held,
            hours_estimated
        });

        await User.updateCredits(requesterId, -credits_held);

        await Offer.updateStatus(offer_id, 'matched');

        logger.info(`Transaction created: ${transaction.id} for offer ${offer_id}`);
        
        res.status(201).json({
            success: true,
            transaction
        });
    } catch (error) {
        logger.error('Create transaction error:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findByUser(req.userId);
        
        res.json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        logger.error('Get transactions error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Check if user is part of this transaction
        if (transaction.requester_id !== req.userId && transaction.provider_id !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to view this transaction' });
        }

        res.json({
            success: true,
            transaction
        });
    } catch (error) {
        logger.error('Get transaction error:', error);
        res.status(500).json({ error: 'Failed to fetch transaction' });
    }
};

exports.confirmCompletion = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const userId = req.userId;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (transaction.status !== 'in_progress') {
            return res.status(400).json({ error: 'Transaction is not in progress' });
            }

        const updated = await Transaction.confirmCompletion(transactionId, userId);
        if (!updated) {
            return res.status(403).json({ error: 'Not authorized to confirm this transaction' });
        }

        logger.info(`Transaction ${transactionId} confirmed by user ${userId}`);
        
        res.json({
            success: true,
            transaction: updated,
            message: 'Completion confirmed. Waiting for other party.'
        });
    } catch (error) {
        logger.error('Confirm completion error:', error);
        res.status(500).json({ error: 'Failed to confirm completion' });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const transactionId = req.params.id;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (transaction.requester_id !== req.userId && transaction.provider_id !== req.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        
