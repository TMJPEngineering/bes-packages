var _ = require('lodash');
var path = require('path');
var mainPath = path.dirname(require.main.filename) + '/';
var logger = require('bes-logger').logger;
var Kernel = require(mainPath + 'app/Http/Kernel');

function helpers() {
    return {
        toController,
        trimUri,
        view,
        Middleware,
        logger,
        resourcePath,
        storagePath,
        appPath
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
        response.sendFile(resourcePath('views/' + filename + '.html'));
    }

    /**
     * Global middleware
     */
    function Middleware(value) {
        var middlewareGroups = [];

        if (_.has(Kernel.default.middlewareGroups, value)) {
            var middlewares = _.get(Kernel.default.middlewareGroups, value);
            middlewares.forEach(function (filePath) {
                middlewareGroups.push(require(mainPath + filePath));
            });
        }

        return middlewareGroups;
    }

    /**
     * Resource Path
     */
    function resourcePath(filename = '') {
        return mainPath + 'resource/' + filename;
    }

    /**
     * Storage Path
     */
    function storagePath(filename = '') {
        return mainPath + 'storage/' + filename;
    }

    /**
     * App Path
     */
    function appPath(filename = '') {
        return mainPath + 'app/' + filename;
    }
}

module.exports = helpers;
