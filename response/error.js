/**
 * response/error
 * contains functions which aid in returning error codes to the client
 */

var logger = require("log4js").getLogger()

exports.sendBadRequest = function(res, message) {
  logger.warn('Sending bad request to the client')
  logger.warn(message)

  var obj = {
    'status': 400,
    'message': message
  }

  res.status(400).send(obj)

}
