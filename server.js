
// Imports
var express = require('express')
var logger = require('log4js').getLogger()

// Setup express
var app = express()
app.use(express.json())

// Setup routes
app.get("/", require("./routes/root"))
app.get("/play", require("./routes/play"))

// Get port and start server
var port = process.env.PORT || 3000
var server = app.listen(port, function() {
  logger.info("Listening on port " + server.address().port)
})
