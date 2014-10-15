/**
 * db/games
 * handles getting and creating games in our database
 * our database is actually just redis, which isn't a database at all but oh well
 */

// Setup redis
var logger = require('log4js').getLogger()
var redis = require('redis')
var url = require('url')

// Do automatic setup if set as an envvar, otherwise manually point to localhost
var client = null
var envvar = process.env.REDISCLOUD_URL

if (envvar) {
  logger.info("Setting up redis client using envvar " + envvar)
  var parsed = url.parse(envvar)
  client = redis.createClient(parsed.port, parsed.hostname, {no_ready_check: true})
  client.auth(parsed.auth.split(":")[1])
} else {
  logger.info("Setting up redis client using localhost")
  client = redis.createClient(6379, 'localhost')
}

// Other imports
var async = require('async')
var gameModel = require('../models/game')
var q = require('q')

// Key expiration time (2 hours)
var timeout = 60*60*2

/** Stores all of the game object information in redis
 *  This is really such a weird use of redis but i figure its fast and i dont need
 *  really persistant data so it should work */
exports.createGame = function(game) {
  logger.info("Setting game " + game.token + " into redis")

  // Create our promise we return
  // This promise is only used for error checking since, right now, this function is implemented synchronously
  var promise = q.defer()

  // Set all the keys in redis
  var token = game.token
  client.set(wordkey(token), game.word)
  client.set(statekey(token), game.state)
  client.set(remainkey(token), game.remaining, function(err, result) {
    if (err) {
      logger.error("Error setting key in redis")
      logger.error(err)
    }
  })

  // Set timeouts
  client.expire(wordkey(token), timeout)
  client.expire(statekey(token), timeout)
  client.expire(remainkey(token), timeout)

  // Return promise
  return promise.promise

}

exports.getGame = function(token) {
  logger.info("Retrieving game " + token + " from redis")

  // Query redis for every key in the game

  var defered = q.defer()
  var game = {}

  async.parallel(
    [
      function(callback) {
        client.get(wordkey(token), function(err, result) {
          game.word = result
          if (err) {
            logger.error("Error retrieving game from redis")
            logger.error(err)
          }
          callback(err, result)
        })
      },
      function(callback) {
        client.get(statekey(token), function(err, result) {
          game.state = result
          callback(err, result)
        })
      },
      function(callback) {
        client.get(remainkey(token), function(err, result) {
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

var wordkey = function(token) {
  return token + '-word'
}

var statekey = function(token) {
  return token + '-state'
}

var remainkey = function(token) {
  return token + '-remaining'
}
