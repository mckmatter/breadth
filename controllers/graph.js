/*
When a request is made for a graph,
this is the route.
*/

//Require Ezpress
var express = require('express')
var router = express.Router()

router.get('/:id', function(req, res) {
	res.render('graph'+req.param.id, {})
})

module.exports = router