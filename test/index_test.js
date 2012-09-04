'use strict'

var assert = require('assert')

var xmlrpc = require('xmlrpc')
var multicall = require('../')

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

// connect an rpc client
var client = xmlrpc.createClient('http://localhost:9005')

it('calls multiple xml rpc methods', function(done) {
  client.methodCall('system.multicall', [
    {'system.add': [2, 2]},
    {'system.add': [4, 4]}
  ]
  , function(err, results) {
    assert.ifError(err)
    assert.deepEqual([
      [4],
      [8]
    ], results)
    done()
  })
})
it('can handle errors in between multiple xml rpc methods', function(done) {
  client.methodCall('system.multicall', [
    {'system.add': [2, 2]},
    {'system.add': []},
    {'system.add': [4, 4]}
  ], function(err, results) {
    assert.ifError(err)
    assert.deepEqual([
      [4],
      { 'faultCode': 789, 'faultString': 'Missing params' },
      [8]
    ], results)
    done()
  })
})
