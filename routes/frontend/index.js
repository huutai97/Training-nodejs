var express = require('express');
var router = express.Router();


/* GET home page. */
router.use('/',require('./home'))
/* GET category page. */
router.use('/category',require('./category'))
/* GET details page. */
router.use('/p',require('./post'))
module.exports = router;
