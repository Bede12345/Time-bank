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

