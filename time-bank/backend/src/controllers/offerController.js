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

