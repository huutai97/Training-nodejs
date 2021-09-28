var express = require('express');
var router = express.Router();


/* GET home admin page. */
router.use('/',require('./dasboard'))
//router.use('/',require('./home'))
router.use('/items', require('./items'));
/* GET user groups admin page. */
router.use('/groups', require('./groups'));
/* GET user admin page. */
router.use('/users', require('./users'));
module.exports = router;
