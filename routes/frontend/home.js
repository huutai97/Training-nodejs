var express = require('express');
var router = express.Router();
const folderView = ('blog/pages/home/');
const ArticleModel = require('../../models/article'); // patch models
const CategoryModel = require('../../models/category'); // patch models
const SocialItem = require('../../models/items'); // patch models
/* GET home admin page. */
router.get('/', async function(req, res, next) { let itemsTrend = [];
  let itemsNew = []; 
  let itemsCategory = [];
  let itemsNewsHomePage = [];
  let itemSocial = [];
   await ArticleModel.listItemFrontend(null,{task:'top-post'}).then((items)=>{
    itemsTrend = items ; 
    });
    await ArticleModel.listItemFrontend(null,{task:'list-news'}).then((items)=>{
      itemsNew = items ; 
      });
    await CategoryModel.listItemFrontend(null,{task:'list-category'}).then((items)=>{
      itemsCategory = items ; 
    });
    await ArticleModel.listItemFrontend(null,{task:'list-news-category-homepage'}).then((items)=>{
      itemsNewsHomePage = items ; 
    });
    await SocialItem.listItemSocial(null,{task:'list-social'}).then((items)=>{
      itemSocial = items ; 
    });
              
    res.render(`${folderView}index`,{
      top_post:true,
      itemsTrend,
      itemsNew,
      itemsCategory,
      itemsNewsHomePage,
      itemSocial
  });
 
});

module.exports = router;
