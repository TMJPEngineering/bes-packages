var csurf = require('csurf');

var BaseVerifier = function (except, request, response, next) {
    var url = request.originalUrl;

    if (except.includes(url)) {
        return next();
    }

    var csrf = csurf({ cookie: true });
    csrf(request, response, next);

    return (request, response, next) => {
        response.cookie('XSRF-TOKEN', request.csrfToken());
        next();
    }
};

module.exports = BaseVerifier;
