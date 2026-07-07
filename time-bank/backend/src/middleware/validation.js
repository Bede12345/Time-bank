const { body, param, query, validationResult } = require('express-validator');

const validators = {

    register: [
        body('username')
            .isLength({ min: 3, max: 50 })
            .withMessage('Username must be 3-50 characters')
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('Username can only contain letters, numbers, and underscores'),

            