/**
 * util/createGame
 * middlewar which handles everything related to creating a new game
 */

var setgame = require('../redis/setgame')
var uuid = require('node-uuid')
var wordlist = require('./wordlist')

module.exports = function() {

  // Create a token for this game
  var token = uuid.v4()

  // Get a word for the game
  var word = wordlist.getWord()

  // Create a state for this game by replacing every alphanum character with an underscore
  var state = ""
  for (var i = 0; i < word.length; i++) {
    if (isAlphaNum(word[i])) {
      state += '_'
    } else {
      state += word[i]
    }
  }

  // Create a game object
  var game = {
    'status': 'ALIVE',
    'token': token,
    'word': word,
    'state': state,
    'remaining': 3
  }

  // Set the game's information in redis
  setgame(game)

  return game

}

var alphanums = [ 'A','B','C','D','E','F','G','H','I','J','K','L','M','N',
                  'O','P','Q','R','S','T','U','V','W','X','Y','Z',
                  'a','b','c','d','e','f','g','h','i','j','k','l','m','n',
                  'o','p','q','r','s','t','u','v','w','x','y','z',
                  '0','1','2','3','4','5','6','7','8','9' ]

var isAlphaNum = function(char) {
  if (alphanums.indexOf(char) < 0) {
    return false
  }
  return true
}
