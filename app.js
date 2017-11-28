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
var express = require('express')
var app = express()
var morgan = require('morgan')

//Log the request to the console with Morgan
app.use(morgan('tiny'))



//Setup Route to public
app.use(express.static('public'))

//Start Server
var port = 80
app.listen(port, function() {
	console.log('App listenting at: ' + port)
})

//End app.js