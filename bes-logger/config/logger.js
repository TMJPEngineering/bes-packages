var Logger = require('./../src/logger');

module.exports = {
    /**
     * Bes logger levels
     * 
     * Available level: info, warn, debug, error
     */
    level: 'info',

    /**
     * Bes logger format
     * 
     * Available format: json, plain
     */
    format: 'json',

    /**
     * Bes logger transports
     */
    transports: [
        new Logger.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new Logger.transports.File({ filename: 'logs/combined.log' })
    ]
};
