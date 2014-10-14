/**
 * models/game
 * contains sanitization functions for game objects stored in redis
 */

var logger = require('log4js').getLogger()

/** verifies that a game object contains what we expect */
exports.isValid = function(game) {

  if (!game.token || !game.word || !game.state || !game.remaining) {
    logger.warn("Game object verification failed")
    return false
  }
  return true

}
