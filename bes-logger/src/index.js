module.exports = function (message, type) {
  if (type === undefined) {
    type = 'log'
  }
  message = new Date().toLocaleString() + ' [' + type.toUpperCase() + ']: ' + message
}
