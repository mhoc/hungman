/*
 * redis/setgame
 * sets a game object's information in redis
 */

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
var keys = require('./keys')
var q = require('q')

// Key expiration time (2 hours)
var timeout = 60*60*2


module.exports = function(game) {

  // This function returns a promise
  // This is included as to match the pattern of the rest of the redis functions
  // We don't actually need it here, obviously

  var defer = q.defer()

  // Set all the keys in redis
  var token = game.token
  client.set(keys.wordkey(token), game.word)
  client.set(keys.statekey(token), game.state)
  client.set(keys.remainkey(token), game.remaining)

  // Set timeouts
  client.expire(keys.wordkey(token), timeout)
  client.expire(keys.statekey(token), timeout)
  client.expire(keys.remainkey(token), timeout)

  // Return promise
  defer.resolve("")
  return defer.promise

}
