/*
app.js

This is the entry point of the node application

To start the application:

sudo node app.js

This application utilizes NodeJS and ExpressJS
nodejs.org
expressjs.com

Dylan McKenna
Fawaz Albetar
ENGR4450-A
Fall 2017
*/

//Import Express and expose
var express = require('express')
var app = express()

//Import FileSystem Module
var fs = require('fs')

//Setup Route to public
app.use(express.static('public'))

//Create route for /graph/:id
app.get('/graph/:id', function(req, res) {
	console.log("Recieved Request From " + req.ip + " for Graph " + req.params.id);

	//Async read graphs file
	fs.readFile('graphs.json', 'utf8', function(err, contents) {

		//Parse graph.json to JavaScript Object
		var graph = JSON.parse(contents)

		//Send an element of the graphs array to the client
		res.json(graph.graphs[req.params.id])
	})
})//END GET /graph/:id

//Start Server
var port = 80
app.listen(port, function() {
	console.log('App listenting at: ' + port)
})

//End app.js