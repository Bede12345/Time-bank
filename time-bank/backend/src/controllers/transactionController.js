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

        