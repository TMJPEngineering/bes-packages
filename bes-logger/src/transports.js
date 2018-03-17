var fs = require('fs');
var path = require('path');

function File(_opts) {
    // TODO: Checker for options
    this.opts = _opts;
    this.save = save;
}

function save(filePath, message) {
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
