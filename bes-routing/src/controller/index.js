function Controller(controllerPath, method) {
    var controller = require(controllerPath).default;
    var instance = new controller;
    return instance[method];
}

module.exports = Controller;
