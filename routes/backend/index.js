var express = require('express');
var router = express.Router();


/* GET home admin page. */
router.use('/',require('./dasboard'))
//router.use('/',require('./home'))
router.use('/items', require('./items'));

module.exports = router;
