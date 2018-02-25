var _ = require('lodash');
var path = require('path');
var helpers = require('bes-utils').helpers;
// var logger = require('bes-logger');

var BaseController = require('./../controller');

var Middleware = helpers.Middleware;
var appPath = path.dirname(require.main.filename);

// BaseRouter object
let BaseRouter = {
    // Options: This is for route group. It uses `prefix` and `middleware`
    allOptions: {},
    // Empty router
    router: {},
    // Config settings
    config: {
        app: null,
        set: (controller, uri, module, middlewares) => {
            let str = false;
            if (typeof controller == 'string') {
                str = controller.split('@');
            }
            if (middlewares == undefined) middlewares = [];
            if (BaseRouter.allOptions != undefined && BaseRouter.allOptions.middleware != undefined) {
                middlewares = _.union(middlewares, BaseRouter.allOptions.middleware);
            }

            BaseRouter.router = {
                str,
                module,
                middlewares,
                uri: (BaseRouter.allOptions !== undefined && BaseRouter.allOptions.prefix !== undefined) ? `/${BaseRouter.allOptions.prefix}${uri}` : uri,
                controller: str ? helpers.toController(str.shift()) : str
            };
        },
        callback: (res, req, next) => {
            next();
        }
    },
    // Set app in config routes
    setApp: app => { BaseRouter.config.app = app; },
    // Set namespace in routes
    setNamespace: module => { BaseRouter.module = module; },
    // Global function for route.
    route: (uri, controller, middlewares, method) => {
        BaseRouter.config.set(controller, uri, BaseRouter.module, middlewares);
        let func = controller;
        if (typeof controller == 'string') {
            func = new BaseController(`${appPath}/modules/${BaseRouter.router.module}/Controllers/${BaseRouter.router.controller}`, BaseRouter.router.str.pop());
        }
        let url = helpers.trimUri(BaseRouter.router.uri);
        let middleware = (BaseRouter.router.middlewares) ? BaseRouter.middleware(BaseRouter.router.middlewares) : BaseRouter.config.callback;
        try {
            BaseRouter.config.app[method](url, middleware, func);
        } catch (e) {
            // logger(`Route Exception: ${e}`);
            console.log('Route Exception:', e);
        }
    },
    // Route all - wrapper for app.all
    all: (uri, controller, middlewares) => {
        BaseRouter.route(uri, controller, middlewares, 'all');
    },
    // Route get for GET/HEAD Method
    get: (uri, controller, middlewares) => {
        BaseRouter.route(uri, controller, middlewares, 'get');
    },
    // Route post for POST Method
    post: (uri, controller, middlewares) => {
        BaseRouter.route(uri, controller, middlewares, 'post');
    },
    // Route update for PUT/PATCH Method
    update: (uri, controller, middlewares) => {
        BaseRouter.route(uri, controller, middlewares, 'put');
    },
    // Route delete for DELETE Method
    delete: (uri, controller, middlewares) => {
        BaseRouter.route(uri, controller, middlewares, 'destroy');
    },
    // Route view for GET Method
    view: (uri, filename, middlewares) => {
        if (BaseRouter.allOptions != undefined && BaseRouter.allOptions.middleware != undefined) {
            middlewares = _.union(middlewares, BaseRouter.allOptions.middleware);
        }
        let middleware = (middlewares) ? BaseRouter.middleware(middlewares) : BaseRouter.config.callback;
        BaseRouter.config.app.get(uri, middleware, (req, res) => {
            helpers.view(filename, res);
        });
    },
    // Route resource is set of routes. It has `index`, `create`, `show`, `edit`, `store`, `update` and `destroy`.
    resource: (uri, controller, middlewares, options) => {
        BaseRouter.config.set(controller);
        let resources = ['index', 'create', 'show', 'edit', 'store', 'update', 'destroy'];

        resources = resources.filter(value => {
            if (options !== undefined && options.only !== undefined) {
                return options.only.indexOf(value) !== -1;
            }
            if (options !== undefined && options.except !== undefined) {
                return options.except.indexOf(value) === 1;
            }
            return true;
        });
        resources.forEach(resource => {
            if (resource !== 'store' && resource !== 'update' && resource !== 'destroy') {
                let str = '';
                if (resource === 'create') {
                    str = '/create';
                }
                if (resource === 'show') {
                    str = '/:id';
                }
                if (resource === 'edit') {
                    str = '/:id/edit';
                }
                BaseRouter.route(`/${uri}${str}`, `${BaseRouter.router.controller}@${resource}`, middlewares, 'get');
            }
            if (resource === 'store') {
                BaseRouter.route(`/${uri}`, `${BaseRouter.router.controller}@${resource}`, middlewares, 'post');
            }
            if (resource === 'update') {
                BaseRouter.route(`/${uri}`, `${BaseRouter.router.controller}@${resource}`, middlewares, 'put');
            }
            if (resource === 'destroy') {
                BaseRouter.route(`/${uri}`, `${BaseRouter.router.controller}@${resource}`, middlewares, 'delete');
            }
        })
    },
    // Route middlewares: Can add 1 or more middleware in a single route
    middleware: middlewares => {
        let groups = [];
        middlewares.forEach(middleware => {
            let _middleware = new Middleware(middleware);
            if (typeof _middleware == 'object') {
                _middleware.forEach(function (callback) {
                    groups.push(callback);
                });
            }
        });
        return groups;
    },
    // When using the route group, always start with a `group` function then ends with the `endGroup` function
    group: (options, callback) => {
        BaseRouter.allOptions = options;
        callback(BaseRouter.allOptions);
    },
    // End of route group
    endGroup: () => {
        BaseRouter.allOptions = undefined;
    },
    // This is the counterpart of req.all
    all: (uri, callback) => {
        BaseRouter.config.app.all(uri, (req, res) => {
            callback(req, res);
        });
    }
}

module.exports = BaseRouter;