class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400);
        this.errors = errors;
        this.name = 'ValidationError';
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

class AuthorizationError extends AppError {
    constructor(message = 'Not authorized') {
        super(message, 403);
        this.name = 'AuthorizationError';
    }
}

class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

const errorHandler = (err, req, res, next) => {
    const { logger } = require('./logger');

    logger.error({
        type: 'error_handler',
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        userId: req.userId
    });

    if (err.code === '23505') {
        return res.status(409).json({
            success: false,
            error: 'Duplicate entry',
            message: err.detail
        });
    }

    if (err.code === '23503') {
        return res.status(400).json({
            success: false,
            error: 'Invalid reference',
            message: 'Referenced record does not exist'
        });
    }

    