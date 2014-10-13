/**
 * util/wordlist
 * Handles reading in the list of possible words
 * and returning a random one at request
 */

// Possible words to return
// Couresy of this guy's server: https://github.com/cushon/hangman/blob/master/server/server.js
var sentences = [
  "the war on the united states",
  "I SEE --HER LADYSHIPS WAITING-MAID",
  "NEVER SAID THE DORMOUSE",
  "OF THE MIDDLE OF THE SQUARE",
  "TREACLE SAID THE CATERPILLAR CONTEMPTUOUSLY",
  "HENCE THERE WAS A FINE TIME",
  "ILLUSTRATION DINING HALL IN THE CHARTERHOUSE",
  "the war on the united states",
  "i should be deceived again",
  "there are to be avoided",
  "the king had said that day",
  "in most of the time",
  "in the reign of louis xiv",
  "but i am all off colour",
  "it would be an unpleasant thing",
  "of the middle classes fig",
  "you must not disappoint your father",
  "on sexual union chapter i",
  "certainly he replied biting his lips",
  "there ain't no sense in it",
  "the price of the yellow metal",
  "men who talk well",
  "in all approximately fifteen millions",
  "the object of open pleasantry",
  "but to restore the southern states",
  "the crown and with one another",
  "oh merely a couple of case-knives",
  "the games of strength and agility",
  "i had shut the door to",
  "elizabeth listened as little as possible",
  "the question was impossible",
  "of the same werke xiijs",
  "you have said quite enough madam",
  "as a matter of talk only",
  "the embassy to achilles",
  "and who is this k",
  "the cause of troy"
]

exports.getWord = function() {

  // Choose a random one
  var word = sentences[Math.floor(Math.random() * sentences.length)]
  return word.toUpperCase()

}
