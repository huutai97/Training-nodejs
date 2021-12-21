var express = require('express');
var router = express.Router();
const folderView = ('blog/pages/category/');

/* GET home admin page. */
router.get('/', function(req, res, next) {
  res.render(`${folderView}index`, { title: 'Trang Chủ' });
});

module.exports = router;
