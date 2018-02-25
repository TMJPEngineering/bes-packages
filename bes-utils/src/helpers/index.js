var path = require('path');
var root = path.dirname(require.main.filename);

function helpers() {
    return {
        toController,
        trimUri,
        view
    }

    /**
     * Add suffix `controller` per file. e.g. `welcome.controller`
     * @return {String}
     */
    function toController(value) {
        return value.replace(/([a-z](?=[A-Z]))Controller/g, '$1.controller').toLowerCase();
    }

    /**
     * Trim slashes
     * @return {String}
     */
    function trimUri(uri) {
        return uri.replace(/\/$/, '');
    }

    /**
     * View helper to load HTML files
     * @return {File}
     */
    function view(file, response) {
        var filename = file.replace(/\./g, '/');
        response.sendFile(root + '/resources/views/' + filename + '.html');
    }
}

module.exports = helpers;