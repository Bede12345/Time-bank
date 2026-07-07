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

    