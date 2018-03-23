var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var mainPath = path.dirname(require.main.filename) + '/';
var logger = require('bes-logger').logger;

function helpers() {
    return {
        toController,
        trimUri,
        view,
        Middleware,
        logger,
        resourcePath,
        storagePath,
        appPath,
        modules: modules()
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
        var Kernel = require(mainPath + 'app/Http/Kernel');
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
        return mainPath + 'resources/' + filename;
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

    /**
     * List of existing modules
     */
    function modules() {
        var modulePath = mainPath + 'modules/';
        var isDirectory = function (source) {
            return fs.lstatSync(source).isDirectory();
        };
        var getDirectories = function (source) {
            return fs.readdirSync(source).map(function (name) {
                return path.join(source, name);
            }).filter(isDirectory);
        };
        var obj = {};
        getDirectories(modulePath).map(function (directory) {
            var folder = path.basename(path.dirname(directory + '/dump.txt'));
            obj[folder.toLowerCase()] = folder;
        });
        return obj;
    }
}

module.exports = helpers;
