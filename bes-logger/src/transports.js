var fs = require('fs');
var path = require('path');
var appPath = path.dirname(require.main.filename);

function File(_opts) {
    // TODO: Checker for options
    this.opts = _opts;
    this.save = save;
}

function save(message) {
    var filename = this.opts.filename;
    if (!filename) return new Error('File not found');

    var filePath = appPath + '/' + filename;
    var dirPath = path.dirname(filePath);
    checkDirectorySync(dirPath);
    fs.appendFileSync(filePath, message);
}

function checkDirectorySync(directory) {  
    try {
        fs.statSync(directory);
    } catch (e) {
        fs.mkdirSync(directory);
    }
}

module.exports = { File: File };
