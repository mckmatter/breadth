/*
This is the entry point of the node application

To start the application:

node app.js

Dylan McKenna
Fawaz Albetar
ENGR4450-A
Fall 2017
*/

//Require Frameworks and expose Express
var mustache = require('mustache-express')
var express = require('express')
var app = express()

//Set View Engine and pass templates path to mustache
app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

//Setup Route to public
app.use(express.static('public'))

//Setup Routes to everything after /
app.use(require('./controllers'))

//Start Server
var port = 3000
app.listen(port, function() {
	console.log('App listenting at: ' + port)
})

//End app.js