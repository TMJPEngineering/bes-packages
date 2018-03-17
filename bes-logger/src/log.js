var path = require('path');
var appPath = path.dirname(require.main.filename);
var nodeEnv = require('node-env-file');
var levels = require('./levels');
var config = require('./config');
var formatText = require('./formatText');
var _env = nodeEnv(appPath + '/.env');
var isDebugged = _env.APP_DEBUG;

function info() {
    this.logMessage = _logMessage(arguments, info);
}

function warn() {
    this.logMessage = _logMessage(arguments, warn);
}

function debug() {
    this.logMessage = _logMessage(arguments, debug);
}

function error() {
    this.logMessage = _logMessage(arguments, error);
}

function _logMessage(args = new Object, func = new Function) {
    var keys = Object.keys(args);
    var output = '';

    keys.forEach(function (key) {
        var arg = args[key];
        if (typeof arg === 'string') output = output + ' ' + arg;
        if (typeof arg === 'object' && config.format === 'json') output = output + ' ' + JSON.stringify(arg);
        if (typeof arg === 'object' && config.format !== 'json') output = output + ' ' + arg;
        output = output.trim();
    });

    var formattedText = formatText(func.name, output);

    config.transports.forEach(function (File) {
        var level = File.opts.level;
        var filePath = File.opts.filename;
        if (!filePath) return new Error('File not found');
        if (!level) {
            level = config.level;
        }
        if (config.log == 'daily') {
            var date = new Date();
            var filenameWithExt = filePath.replace(/^.*[\\\/]/, '');
            var dirPath = path.dirname(filePath) + '/';
            var filename = filenameWithExt.split('.').shift();
            filePath = dirPath + filename + '-' + date.toLocaleDateString().split('/').join('-') + '.log';
        }

        if (isDebugged == 'false' && func === debug) return;
        if (levels[level] <= levels[func.name]) File.save(filePath, formattedText);
    });
}

module.exports = {
    info: info,
    warn: warn,
    debug: debug,
    error: error
};
