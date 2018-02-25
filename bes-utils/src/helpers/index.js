var _ = require('lodash');
var path = require('path');
var root = path.dirname(require.main.filename);
var Kernel = require(root + '/app/Http/Kernel');

function helpers() {
    return {
        toController,
        trimUri,
        view,
        Middleware
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

    /**
     * Global middleware
     */
    function Middleware(value) {
        var rootPath = root + '/';
        var middlewareGroups = [];

        if (_.has(Kernel.default.middlewareGroups, value)) {
            var middlewares = _.get(Kernel.default.middlewareGroups, value);
            middlewares.forEach(function (filePath) {
                middlewareGroups.push(require(rootPath + filePath));
            });
        }

        return middlewareGroups;
    }
}

module.exports = helpers;