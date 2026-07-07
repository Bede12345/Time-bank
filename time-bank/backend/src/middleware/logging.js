const { logger } = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    logger.info({
        type: 'request',
        method: req.method,
        url: req.url,
        query: req.query,
        body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    