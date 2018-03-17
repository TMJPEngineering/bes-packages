module.exports = function (type, value) {
    var newLine = (process.platform === 'win32' ? '\r\n' : '\n');
    return new Date().toLocaleString() + ' [' + type.toUpperCase() + ']: ' + value + newLine;
};
