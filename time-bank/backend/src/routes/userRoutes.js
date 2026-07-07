const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validators, validate, sanitize } = require('../middleware/validation');
const {
    getUserProfile,
    updateProfile,
    getUserOffers,
    getUserTransactions,
    getTopUsers
} = require('../controllers/userController');

router.get('/top', getTopUsers);
router.get('/:id/profile', getUserProfile);

router.get('/me', authenticate, getUserProfile);
router.put('/me', 
    authenticate,
    sanitize.user,
    validators.register,
    validate,
    updateProfile
);
