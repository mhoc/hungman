/**
 * routes/route.js
 * contains handler for the root url, which is basically just a 200 status check
*/

var status = require("../response/status")

module.exports = function(req, res) {

  // Send a simple 200 back to the client
  status.sendOK(res)

}
