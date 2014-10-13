/*
 * util/guess.js
 * places a guess on a given game and updates all fields in redis
 */

var q = require('q')
var redis = require('../db/games')

module.exports = function(token, guess) {

  // Get the game associated with the guess
  // Im not sure if i fully understand promises yet, need more practice

  var defer = q.defer()

  // If their guess is more than 1 character long, throw it out
  if (guess.length > 1) {
    defer.reject(new Error("Guess length can only be 1 character long"))
    return defer.promise
  }

  redis.getGame(token).then(gotGame(defer, guess), gotGameError(defer))

  return defer.promise

}

var gotGame = function(defer, guess) {

  return function(game) {

    // If they have no remaining guesses left do nothing
    if (game.remaining <= 0) {
      game.status = "DEAD"
      defer.resolve(game)
      return
    }

    // Iterate over the state and illuminate any characters that they have guesses
    var state = game.state

    var newstate = ""
    var correct = false
    for (var i = 0; i < state.length; i++) {
      if (game.word[i] == guess) {
        newstate += game.word[i]
        correct = true
      } else {
        newstate += state[i]
      }
    }
    game.state = newstate

    // Decrement their guesses
    if (!correct) {
      game.remaining--
    }

    // So hacky if you think about what's happening here
    if (game.remaining == 0 && game.state.indexOf('_') >= 0) {
      game.status = "DEAD"
    } else {
      game.status = "ALIVE"
    }

    // Recommit the game to redis
    redis.createGame(game)

    // Return it
    defer.resolve(game)

  }

}

var gotGameError = function(defer) {

  return function(error) {
    defer.reject(error)
  }

}
