/**
 * routes/play
 * Handles the /play route for the api
 */

var creategame = require('../util/creategame')
var guess = require('../util/guess')
var logger = require('log4js').getLogger()
var error = require('../response/error')

module.exports = function(req, res) {

  // Parse out the options provided by the client
  var code = req.param('code')
  var token = req.param('token')
  var guess = req.param('guess')

  // Return a 400 if no code is provided
  if (!code) {
    error.sendBadRequest(res, 'No code provided')
    return
  }

  // If no token and guess is provided then they are requesting a new prisoner
  if (!token && !guess) {
    getNewPrisoner(res)
    return
  }

  // If both a token and guess are provided then they are placing a guess
  if (token && guess) {
    placeGuess(res, token.toUpperCase(), guess.toUpperCase())
    return
  }

  // Anything else is a bad request
  error.sendBadRequest(res, 'Must provide code, token, and guess parameters')

}

var getNewPrisoner = function(res) {

  // Create a game for the player
  var game = creategame()

  // Send back a new object with game information
  var obj = {
    'status': 'ALIVE',
    'token': game.token,
    'remaining_guesses': game.remaining,
    'state': game.state
  }

  res.status(200).send(obj)

}

var placeGuess = function(res, token, guessC) {

  var r = guess(token, guessC)
  r.then(function(game) {

      var obj = {
        'status': game.status,
        'token': game.token,
        'remaining_guesses': game.remaining,
        'state': game.state
      }

      res.send(obj)

  }, function(e) {
      res.send(e)
  })


}
