/*
 * response/status.js
 * contains functions which aid in returning 200 level status codes to the client
 * when more specific json objects aren't applicable
 */


exports.sendOK = function(res) {

  var obj = {
    "status": 200,
    "message": "Ok"
  }

  res.status(200).send(obj)

}
