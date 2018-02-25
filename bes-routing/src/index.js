var Router = require('./router');
var BaseController = require('./controller');

function Routing() {
    return {
        BaseController,
        Router
    }
}

module.exports = Routing;
