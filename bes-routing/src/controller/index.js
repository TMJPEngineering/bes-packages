function Controller(controllerPath, method) {
    var controller = require(controllerPath);
    return controller[method];
}

module.exports = Controller;