var express = require('express');
var router = express.Router();
const folderView = ('blog/pages/home/');
const ArticleModel = require('../../models/article'); // patch models
/* GET home admin page. */
router.get('/', async function(req, res, next) {
  let itemsTrend = [];
  let itemsNew = []; 
  console.log()
   await ArticleModel.listItemFrontend(null,{task:'top-post'}).then((items)=>{
    itemsTrend = items ; 
    });
    await ArticleModel.listItemFrontend(null,{task:'list-news'}).then((items)=>{
      itemsNew = items ; 
      });
    res.render(`${folderView}index`,{
      top_post:true,
      itemsTrend,
      itemsNew
  });
});

module.exports = router;
