const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const {
    createTransaction,
    getTransactions,
    getTransaction,
    confirmCompletion,
    updateTransactionStatus
} = require('../controllers/transactionController');

const transactionValidation = [
    body('offer_id').isInt().withMessage('Valid offer ID is required'),
    body('hours_estimated').isInt({ min: 1 }).withMessage('Hours must be at least 1'),
];

router.post('/', authenticate, transactionValidation, createTransaction);
router.get('/', authenticate, getTransactions);
router.get('/:id', authenticate, getTransaction);
router.patch('/:id/confirm', authenticate, confirmCompletion);
router.patch('/:id/status', authenticate, updateTransactionStatus);

module.exports = router;