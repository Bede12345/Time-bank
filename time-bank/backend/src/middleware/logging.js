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

    const oldJson = res.json;
    res.json = function(data) {
        const duration = Date.now() - start

         logger.info({
            type: 'response',
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            userId: req.userId
        });

        