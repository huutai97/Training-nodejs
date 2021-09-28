var express = require('express');
var router = express.Router();
const systemConfig = require('./../../configs/system');
const GroupsModel = require('./../../schemas/groups');
const ValidateGroups = require('./../../validator/groups');
const helperPublish = require('./../../helper-publish/utils');
const paramHelper = require('./../../helper-publish/params');
const folderView = 'pages/groups/';


const linkIndex = '/' + systemConfig.admin + '/groups/';

 

/* GET items list. */ 
router.get('(/status/:status)?', async (req, res, next) =>{
    
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateGroups.validator(req);
    let save = Object.assign(req.body);
    let errorsSave = req.validationErrors();
    let obj = {};
    let id   = paramHelper.getParam(req.params,    'id',    '');
    let item = {name: '',ordering:0,    status: 'novalue'}; // truyền giá trị để add item
    let search = paramHelper.getParam(req.query,    'search','');
    let currentStatus = paramHelper.getParam(req.params,'status','all');
    let statusFilter =  await helperPublish.createFillterStatus(currentStatus,'groups');
    let paginaTion = {
            totalItem : 1,
            totalperPage : 5,
            currentPage : 1,
            pageRange:3,
    };
    paginaTion.currentPage = parseInt(paramHelper.getParam(req.query,'page',1));
   
   
    if(currentStatus !=='all')   obj.status = currentStatus;
    if(search !== '') obj.name = new RegExp(search,'i');


    await GroupsModel.count(obj).then((data)=>{
        paginaTion.totalItem = data;
        GroupsModel
        .find(obj)
        .select('name status ordering slug created modifined group_acp ')
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
    await GroupsModel.updateOne({_id:   id},data,(err,result)=>{
     
        res.redirect(linkIndex);
    })
    
   
});
/*  change groups item. */
router.get('/change-groups-acp/:id/:group_acp', (req, res, next)=> {
    let currentGroups = paramHelper.getParam(req.params,'group_acp','yes');
    let id            = paramHelper.getParam(req.params,'id','');
    let groupsACP     = (currentGroups === "yes") ? "no": "yes";
    let data          = {
        group_acp:groupsACP,
        modified: {
            user_id :   0,
            user_name: "Assmin",
            time: Date.now()
        }
    }
    
  
     GroupsModel.updateOne({_id:   id},data,(err,result)=>{
        
        res.redirect(linkIndex);
    })
    
   
});

/*  delete item. */
router.get('/delete/:slug', async (req, res, next)=> {
    let slug            = paramHelper.getParam(req.params,    'slug',   '');
    await  GroupsModel.deleteOne({slug:   slug},(err,result)=>{
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
        GroupsModel.findOne({slug:slug},  (err,   item)=>{   
            res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,  errors }); 
            
        });
       
       
    }
   
    
 });

/*  save item. */
router.post('/save', async (req, res, next)=> {
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateGroups.validator(req);

    let item = Object.assign(req.body);
    let errors = req.validationErrors();

    if(typeof item !== "undefined" && item.id !== ""){
        if(errors){
           
            res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,   errors});
        }else{
             await   GroupsModel.updateOne({_id: item.id},{
                    name:item.name,
                    ordering:parseInt(item.ordering),
                    slug:item.slug,
                    status: item.status,
                    content:item.content,
                    group_acp: item.group_acp,
                    modified: {
                        user_id: 0,
                        user_name : 0,
                        time: Date.now()
                    
                    }
                    
                },(err,result) =>   {
                    
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
           
           new GroupsModel(item).save().then(()=>{
               res.redirect(linkIndex);
            
           })
           
        }
    }
  
 
});

module.exports = router;
