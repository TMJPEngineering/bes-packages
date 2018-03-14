var csurf = require('csurf');

var BaseVerifier = function (except, request, response, next) {
    var url = request.originalUrl;

    if (except.includes(url)) {
        return next();
    }

    var csrf = csurf({ cookie: true });
    return csrf(request, response, next);
};

module.exports = BaseVerifier;
