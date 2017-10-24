/*
index.js

This is the index controller. All requests other
than the index request (/) hit this controller. 

This index controller than forwards the request
to the apporpriate controller based on the URI
*/

//Use the Router method within express
var express = require('express')
var router = express.Router()

//graph route
router.use('/graph', require('./graph'))

//Export routes to app.js
module.exports = router;

