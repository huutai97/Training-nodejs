var express = require('express');
var router = express.Router();


/* GET home admin page. */
router.use('/',require('./dasboard'))
//router.use('/',require('./home'))
router.use('/items', require('./items'));
/* GET groups groups admin page. */
router.use('/groups', require('./groups'));
/* GET user admin page. */
router.use('/users', require('./users'));
/* GET category admin page. */
router.use('/category', require('./category'));
/* GET article admin page. */
router.use('/article', require('./article'));
/* GET login admin page. */
router.use('/auth', require('./auth'));

module.exports = router;
