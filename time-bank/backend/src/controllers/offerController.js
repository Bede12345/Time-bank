const Offer = require('../models/Offer');
const { logger } = require('../utils/logger');
const { validationResult } = require('express-validator');

exports.createOffer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const offerData = {
            ...req.body,
            user_id: req.userId
        };

        const offer = await Offer.create(offerData);
        
        logger.info(`Offer created: ${offer.title} by user ${req.userId}`);
        
        res.status(201).json({
            success: true,
            offer
        });
    } catch (error) {
        logger.error('Create offer error:', error);
        res.status(500).json({ error: 'Failed to create offer' });
    }
};

exports.getOffers = async (req, res) => {
    try {
        const filters = {
            category: req.query.category,
            type: req.query.type,
            limit: req.query.limit || 50
        };

        const offers = await Offer.findAll(filters);
        
        res.json({
            success: true,
            count: offers.length,
            offers
        });
    } catch (error) {
        logger.error('Get offers error:', error);
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
};

exports.getOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        res.json({
            success: true,
            offer
        });
    } catch (error) {
        logger.error('Get offer error:', error);
        res.status(500).json({ error: 'Failed to fetch offer' });
    }
};

exports.getMyOffers = async (req, res) => {
    try {
        const offers = await Offer.getUserOffers(req.userId);
        
        res.json({
            success: true,
            count: offers.length,
            offers
        });
    } catch (error) {
        logger.error('Get my offers error:', error);
        res.status(500).json({ error: 'Failed to fetch your offers' });
    }
};

exports.updateOfferStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const offerId = req.params.id;

        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        if (offer.user_id !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to update this offer' });
        }

        const updated = await Offer.updateStatus(offerId, status);
        
        logger.info(`Offer ${offerId} status updated to ${status} by user ${req.userId}`);
        
        res.json({
            success: true,
            offer: updated
        });
    } catch (error) {
        logger.error('Update offer error:', error);
        res.status(500).json({ error: 'Failed to update offer' });
    }
};


