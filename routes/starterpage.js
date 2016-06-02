var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('starter', { title: 'Here is the starter page!' });
});

module.exports = router;