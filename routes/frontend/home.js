var express = require('express');
var router = express.Router();


/* GET home admin page. */
router.get('/', function(req, res, next) {
  res.render('pages/publish/index', { title: 'Trang Chủ' });
});

module.exports = router;
