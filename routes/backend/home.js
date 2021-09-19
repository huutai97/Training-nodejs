var express = require('express');
var router = express.Router();


/* GET home admin page. */
router.get('/', function(req, res, next) {
  res.render('pages/home/index', { title: 'Hệ Thống Quản Trị' });
});

module.exports = router;
