var express = require('express');
var router = express.Router();


/* GET home admin page. */
router.get('/', function(req, res, next) {
  res.render('pages/erp/index', { title: 'Hệ Thống Quản Trị' });
  // ngoai do dung bien
});

module.exports = router;
