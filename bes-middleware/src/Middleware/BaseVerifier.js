var BaseVerifier = function (except, request, response, next) {
    var url = request.originalUrl;

    if (except.includes(url)) {
        response.clearCookie('_csrf');
        response.clearCookie('XSRF-TOKEN');
    }

    return next();
};

module.exports = BaseVerifier;