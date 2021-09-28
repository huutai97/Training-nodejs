var express = require('express');
var router = express.Router();
const systemConfig = require('./../../configs/system');
const usersModel = require('./../../schemas/users');
const GroupsModel = require('./../../schemas/groups');
const ValidateUsers = require('./../../validator/users');
const helperPublish = require('./../../helper-publish/utils');
const paramHelper = require('./../../helper-publish/params');
const folderView = 'pages/users/';


const linkIndex = '/' + systemConfig.admin + '/users/';

 

/* GET items list. */ 
router.get('(/status/:status)?', async (req, res, next) =>{
    
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateUsers.validator(req);
    let save = Object.assign(req.body);
    let errorsSave = req.validationErrors();
    let obj = {};
    let id   = paramHelper.getParam(req.params,    'id',    '');
    let item = {userName: '',ordering:0,    status: 'novalue'}; // truyền giá trị để add item
    let search = paramHelper.getParam(req.query,    'search','');
    let currentStatus = paramHelper.getParam(req.params,'status','all');
    let statusFilter =  await helperPublish.createFillterStatus(currentStatus,'users');
    let paginaTion = {
            totalItem : 1,
            totalperPage : 5,
            currentPage : 1,
            pageRange:3,
    };
    let groupsItems = [];
    await GroupsModel.find({},{_id:1,name:1}).then((items)=>{
        groupsItems = items
    })
    paginaTion.currentPage = parseInt(paramHelper.getParam(req.query,'page',1));
   
   
    if(currentStatus !=='all')   obj.status = currentStatus;
    if(search !== '') obj.userName = new RegExp(search,'i');


    await usersModel.count(obj).then((data)=>{
        paginaTion.totalItem = data;
        usersModel
        .find(obj)
        .sort({_id:'descending'})
        .select('userName status odering crated content modified group.name')
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
                    errorsSave,
                    groupsItems,

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
    await usersModel.updateOne({_id:   id},data,(err,result)=>{
      
        res.redirect(linkIndex);
    })
    
   
});
/*  change groups item. */
router.get('/change-groups-acp/:id/:group_acp', (req, res, next)=> {
    let currentUsers= paramHelper.getParam(req.params,'group_acp','yes');
    let id            = paramHelper.getParam(req.params,'id','');
    let UsersACP     = (currentUsers === "yes") ? "no": "yes";
    let data          = {
        group_acp:UsersACP,
        modified: {
            user_id :   0,
            user_name: "Assmin",
            time: Date.now()
        }
    }
    console.log(data)
  
    usersModel.updateOne({_id:   id},data,(err,result)=>{
        
        res.redirect(linkIndex);
    })
    
   
});


/* form item . */
router.get('/form(/:id)?', async   (req, res, next)=> {
   
    let id   = paramHelper.getParam(req.params,    'id',    '');
    let item = {userName: '',ordering:0,    status: 'novalue',group:'',group_name:''};
    
    let groupsItems = [];
    await GroupsModel.find({},{_id:1,name:1}).then((items)=>{
        groupsItems = items
        groupsItems.unshift({_id: 'novalue',name: 'Vui lòng chọn Groups' });
    });
   

    let errors = null; 
    if(id === ''){ //add
        res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,  errors,groupsItems }); 
    }else{ //edit
         usersModel.findById(id,  (err,   item)=>{   
            item.group = item.group.id;
            item.group_name = item.group.name;
            res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,  errors,groupsItems }); 
            
        });
      
       
    }
   
    
 });

/*  save item. */
router.post('/save', async (req, res, next)=> {
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateUsers.validator(req);

    let item = Object.assign(req.body);
    let errors = req.validationErrors();

    if(typeof item !== "undefined" && item.id !== ""){
        if(errors){
           
            res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,   errors,groupsItems});
        }else{
             await  usersModel.updateOne({_id: item.id},{
                    userName:item.userName,
                    ordering:parseInt(item.ordering),
                    slug:item.slug,
                    status: item.status,
                    content:item.content,
                    group : {
                        id: item.group,
                        name: item.group_name,
                       },
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
            let groupsItems = [];
            await GroupsModel.find({},{_id:1,name:1}).then((items)=>{
                groupsItems = items
                groupsItems.unshift({_id: 'novalue',name: 'Vui lòng chọn Groups' });
            });
            res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,   errors,groupsItems});
        }else{
            item.crated = {
                user_id: 0,
                user_name : "AssMin",
                time: Date.now(),
            },
           item.group = {
            id: item.group,
            name: item.group_name,
           },
           new usersModel(item).save().then(()=>{
               res.redirect(linkIndex);
            
           })
      
        }
    }
  
 
});
/*  delete item. */
router.get('/delete/:id', async (req, res, next)=> {
    let id            = paramHelper.getParam(req.params,    'id',   '');
    await  usersModel.deleteOne({_id:   id},(err,result)=>{
        res.redirect(linkIndex);
    })
});

module.exports = router;
