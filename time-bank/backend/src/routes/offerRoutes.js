const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const {
    createOffer,
    getOffers,
    getOffer,
    getMyOffers,
    updateOfferStatus,
    deleteOffer
} = require('../controllers/offerController');

const offerValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('type').isIn(['offer', 'request']).withMessage('Type must be offer or request'),
    body('credits_per_hour').isInt({ min: 1 }).withMessage('Credits per hour must be at least 1'),
];

router.post('/', authenticate, offerValidation, createOffer);
router.get('/', getOffers);
router.get('/my', authenticate, getMyOffers);
router.get('/:id', getOffer);
router.patch('/:id/status', authenticate, updateOfferStatus);
router.delete('/:id', authenticate, deleteOffer);

module.exports = router;