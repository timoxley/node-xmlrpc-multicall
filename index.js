'use strict'

var async = require('async')

module.exports = function(server) {
  server.on('system.multicall', function(err, methods, callback) {
    async.map(methods, function(methodHash, next) {
      var methodName = Object.keys(methodHash).pop()
      var params = methodHash[methodName]
      server.emit(methodName, null, params, function(err) {
        if (err) return next(null, err)
        return next(null, Array.prototype.slice.call(arguments, 1))
      })
    }, callback)
  })
}
