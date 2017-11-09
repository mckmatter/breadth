/*
When a request is made for a graph,
this is the route.
*/

//Require Ezpress
var express = require('express')
var router = express.Router()

router.get('/:id', function(req, res) {
	console.log("Recieved Request to /graph")
	console.log(req.params)

	res.render('graph'+req.params.id, {})
})

module.exports = router