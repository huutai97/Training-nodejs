var express = require('express');
var router = express.Router();


/* GET home admin page. */
router.use('/',require('./home'))

module.exports = router;
