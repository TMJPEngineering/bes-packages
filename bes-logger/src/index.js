var log = require('./log');
var levels = require('./levels');

var logger = {
    levels: levels,
    info: log.info,
    warn: log.warn,
    debug: log.debug,
    error: log.error
};

module.exports = {
    logger: logger
}
