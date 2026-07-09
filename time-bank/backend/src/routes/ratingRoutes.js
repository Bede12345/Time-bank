const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validators, validate } = require('../middleware/validation');
const ratingController = require('../controllers/ratingController');

router.post('/',
    authenticate,
    validators.createRating,
    validate,
    ratingController.createRating
);

router.get('/me',
    authenticate,
    ratingController.getUserRatings
);

router.get('/stats/:userId?',
    authenticate,
    ratingController.getRatingStats
);

router.get('/user/:userId',
    ratingController.getUserRatings
);

router.get('/transaction/:transactionId',
    authenticate,
    ratingController.getTransactionRatings
);

router.delete('/:id',
    authenticate,
    ratingController.deleteRating
);

module.exports = router;
