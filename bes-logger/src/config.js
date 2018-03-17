var fs = require('fs');
var path = require('path');
var appPath = path.dirname(require.main.filename);
var logger = fs.existsSync(appPath + '/config/logger') ? require(appPath + '/config/logger') : {};
var opts = require('./../config/logger');

if (logger.log) opts.log = logger.log;
if (logger.level) opts.level = logger.level;
if (logger.format) opts.format = logger.format;
if (logger.transports) opts.transports = logger.transports;

module.exports = {
    log: opts.log,
    level: opts.level,
    format: opts.format,
    transports: opts.transports
};
