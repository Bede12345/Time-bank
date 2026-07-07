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

        if (res.statusCode >= 400) {
            logger.error({
                type: 'error_response',
                method: req.method,
                url: req.url,
                status: res.statusCode,
                data: data
            });
        }

        oldJson.call(this, data);
    };

    next();
};

const performanceLogger = (req, res, next) => {
    const start = process.hrtime();
    
    res.on('finish', () => {
        const diff = process.hrtime(start);
        const duration = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);
        
        if (duration > 1000) {
            logger.warn({
                type: 'slow_request',
                method: req.method,
                url: req.url,
                duration: `${duration}ms`,
                userId: req.userId
            });
        }
    });
    
    next();
};

const securityLogger = (event, req, details = {}) => {
    logger.warn({
        type: 'security',
        event,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.userId,
        ...details
    });
};

module.exports = {
    requestLogger,
    performanceLogger,
    securityLogger
};