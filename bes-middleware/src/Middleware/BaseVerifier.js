var csurf = require('csurf');

var BaseVerifier = function (except, request, response, next) {
    var path = request.route.path;

    if (except.includes(path)) {
        return next();
    }

    var csrf = csurf({ cookie: true });
    return csrf(request, response, next);
};

module.exports = BaseVerifier;
