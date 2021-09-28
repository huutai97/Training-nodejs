var express = require('express');
var router = express.Router();
const systemConfig = require('./../../configs/system');
const itemModel = require('./../../schemas/items');
const ValidateItems = require('./../../validator/items');
const helperPublish = require('./../../helper-publish/utils');
const paramHelper = require('./../../helper-publish/params');
const folderView = 'pages/items/';


const linkIndex = '/' + systemConfig.admin + '/items/';

 

/* GET items list. */ 
router.get('(/status/:status)?', async (req, res, next) =>{
    
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateItems.validator(req);
    let save = Object.assign(req.body);
    let errorsSave = req.validationErrors();
    let obj = {};
    let id   = paramHelper.getParam(req.params,    'id',    '');
    let item = {name: '',ordering:0,    status: 'novalue'}; // truyền giá trị để add item
    let search = paramHelper.getParam(req.query,    'search','');
    let currentStatus = paramHelper.getParam(req.params,'status','all');
    let statusFilter =  await helperPublish.createFillterStatus(currentStatus,'items');
    let paginaTion = {
            totalItem : 1,
            totalperPage : 5,
            currentPage : 1,
            pageRange:3,
    };
    paginaTion.currentPage = parseInt(paramHelper.getParam(req.query,'page',1));
   
   
    if(currentStatus !=='all')   obj.status = currentStatus;
    if(search !== '') obj.name = new RegExp(search,'i');


    await itemModel.count(obj).then((data)=>{
        paginaTion.totalItem = data;
        itemModel
        .find(obj)
        .sort({_id:'descending'})
        .skip((paginaTion.currentPage-1)    *   paginaTion.totalperPage)
        .limit(paginaTion.totalperPage)
        .then((items)=>{
                res.render(`${folderView}/list`, { 
                    title: 'Danh sách item', 
                    items:items,
                    statusFilter : statusFilter,
                    paginaTion : paginaTion,
                    currentStatus : currentStatus,
                    search,
                    item,
                    save,
                    errorsSave
                });
        });
        
    })
    
   
});
/*  change status item. */
router.get('/change-status/:id/:status', async (req, res, next)=> {
    let currentStatus = paramHelper.getParam(req.params,    'status',   'active');
    let id            = paramHelper.getParam(req.params,    'id',   '');
    let status        = (currentStatus === "active")    ?   "inactive"  :   "active";
    let data          = {
        status:status,
        modified: {
            user_id :   0,
            user_name: 0,
            time: Date.now()
        }
    }
    await itemModel.updateOne({_id:   id},data,(err,result)=>{
        console.log(data);
        res.redirect(linkIndex);
    })
    
   
});


/*  delete item. */
router.get('/delete/:slug', async (req, res, next)=> {
    let slug            = paramHelper.getParam(req.params,    'slug',   '');
    await  itemModel.deleteOne({slug:   slug},(err,result)=>{
        res.redirect(linkIndex);
    })
});

/* form item . */
router.get('/form(/:slug)?',   (req, res, next)=> {
   
    let slug   = paramHelper.getParam(req.params,    'slug',    '');
    let item = {name: '',ordering:0,    status: 'novalue'};
    let errors = null;
    if(slug === ''){ //add
        res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,  errors }); 
    }else{ //edit
         itemModel.findOne({slug:slug},  (err,   item)=>{   
            res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,  errors }); 
            
        });
       
       
    }
   
    
 });

/*  save item. */
router.post('/save', async (req, res, next)=> {
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateItems.validator(req);

    let item = Object.assign(req.body);
    let errors = req.validationErrors();

    if(typeof item !== "undefined" && item.id !== ""){
        if(errors){
           
            res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,   errors});
        }else{
             await   itemModel.updateOne({_id: item.id},{
                    name:item.name,
                    ordering:parseInt(item.ordering),
                    slug:item.slug,
                    status: item.status,
                    content:item.content,
                    modified: {
                        user_id: 0,
                        user_name : 0,
                        time: Date.now()
                    
                    }
                    
                },(err,result) =>   {
                    console.log(item);
                    res.redirect(linkIndex);
                });
        }
    }else
    {
        if(errors){
            
            res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,   errors});
        }else{
            item.crated = {
                user_id: 0,
                user_name : "AssMin",
                time: Date.now(),
            },
           
           new itemModel(item).save().then(()=>{
               res.redirect(linkIndex);
            
           })
           console.log(item);
        }
    }
  
 
});

module.exports = router;
