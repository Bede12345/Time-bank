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

