const { body, param, query, validationResult } = require('express-validator');

const validators = {

    register: [
        body('username')
            .isLength({ min: 3, max: 50 })
            .withMessage('Username must be 3-50 characters')
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('Username can only contain letters, numbers, and underscores'),

        body('email')
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
            .withMessage('Password must contain at least one letter and one number'),
        body('full_name')
            .notEmpty()
            .withMessage('Full name is required')
            .isLength({ max: 100 })
            .withMessage('Full name cannot exceed 100 characters'),
        body('bio')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Bio cannot exceed 500 characters'),
        body('skills')
            .optional()
            .isArray()
            .withMessage('Skills must be an array')
    ],

    login: [
        body('email')
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],

    createOffer: [
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ max: 200 })
            .withMessage('Title cannot exceed 200 characters'),
        body('description')
            .notEmpty()
            .withMessage('Description is required')
            .isLength({ max: 2000 })
            .withMessage('Description cannot exceed 2000 characters'),
        body('category')
            .notEmpty()
            .withMessage('Category is required')
            .isIn(['Technology', 'Education', 'Home Services', 'Creative', 'Health', 'Business', 'Other'])
            .withMessage('Invalid category'),
        body('type')
            .isIn(['offer', 'request'])
            .withMessage('Type must be offer or request'),
        body('credits_per_hour')
            .isInt({ min: 1, max: 100 })
            .withMessage('Credits per hour must be between 1 and 100'),
        body('location')
            .optional()
            .isLength({ max: 100 })
            .withMessage('Location cannot exceed 100 characters'),
        body('is_remote')
            .optional()
            .isBoolean()
            .withMessage('is_remote must be a boolean'),
        body('expires_at')
            .optional()
            .isISO8601()
            .withMessage('Invalid date format')
            .toDate()
    ],

    createTransaction: [
        body('offer_id')
            .isInt()
            .withMessage('Valid offer ID is required'),
        body('hours_estimated')
            .isInt({ min: 1, max: 40 })
            .withMessage('Estimated hours must be between 1 and 40')
    ],

    