var transports = require('./transports');

function Logger() {
    this.transports = transports;
};

module.exports = new Logger;
