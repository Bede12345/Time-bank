const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validators, validate } = require('../middleware/validation');
const ratingController = require('../controllers/ratingController');

// Create a rating (authenticated)
router.post('/',
    authenticate,
    validators.createRating,
    validate,
    ratingController.createRating
);

// Get user's ratings (authenticated)
router.get('/me',
    authenticate,
    ratingController.getUserRatings
);

// Get rating stats for a user (authenticated)
router.get('/stats/:userId?',
    authenticate,
    ratingController.getRatingStats
);

// Get ratings for a specific user (public)
router.get('/user/:userId',
    ratingController.getUserRatings
);

// Get ratings for a transaction (authenticated)
router.get('/transaction/:transactionId',
    authenticate,
    ratingController.getTransactionRatings
);

// Delete a rating (authenticated)
router.delete('/:id',
    authenticate,
    ratingController.deleteRating
);

module.exports = router;
