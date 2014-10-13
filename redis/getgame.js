
// Set up redis client
var redis = require('redis')
var url = require('url')

// Do automatic setup if set as an envvar, otherwise manually point to localhost
var client = null
var envvar = process.env.REDISCLOUD_URL

if (envvar) {
  var parsed = url.parse(envvar)
  client = redis.createClient(parsed.port, parsed.hostname, {no_ready_check: true})
  client.auth(parsed.auth.split(":")[1]);
} else {
  client = redis.createClient(6379, 'localhost')
}

// Other imports
var async = require('async')
var keys = require('./keys')
var q = require('q')


module.exports = function(token) {

  // Query redis for every key in the game

  var defered = q.defer()
  var game = {}

  async.parallel(
    [
      function(callback) {
        client.get(keys.wordkey(token), function(err, result) {
          game.word = result
          callback(err, result)
        })
      },
      function(callback) {
        client.get(keys.statekey(token), function(err, result) {
          game.state = result
          callback(err, result)
        })
      },
      function(callback) {
        client.get(keys.remainkey(token), function(err, result) {
          game.remaining = result
          callback(err, result)
        })
      }
    ],
    function(err, results) {
      game.token = token
      if (err) {
        defered.reject(err)
      } else {
        defered.resolve(game)
      }
    }
  )

  return defered.promise

}
