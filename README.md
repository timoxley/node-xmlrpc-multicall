# XML-RPC Multicall

Implements system.multicall RFC:
http://mirrors.talideon.com/articles/multicall.html for [baalexander's
xmlrpc module](https://github.com/baalexander/node-xmlrpc/).

```js
var xmlrpc = require('xmlrpc')
var multicall = require('xmlrpc-multicall')

var server = xmlrpc.createServer('http://localhost:9005')
multicall(server) // attach multicall method to server

// Example rpc method that adds together any params given
server.on('system.add', function(err, params, callback) {
  if (!params.length) {
    return callback({ 'faultCode': 789, 'faultString': 'Missing params' })
  }
  callback(null, params.reduce(function(prev, curr) {
    return prev + curr
  }, 0))
})

var client = xmlrpc.createClient('http://localhost:9005')

// call multiple xml rpc methods
client.methodCall('system.multicall', [
    {'system.add': [2, 2]},
    {'system.add': [4, 4]}
  ], function(err, results) {
    // results => // [[4], [8]]
  })
})
```
