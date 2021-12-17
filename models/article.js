const ArticleModel = require('../schemas/article');
const fs = require('fs');
const FolderUpload = ('public/upload/thumb/');
module.exports = {
    listItems : (params,options = null )=>{
        let obj = {};
        if(params.currentStatus !=='all')   obj.status = params.currentStatus;
        if(params.search !== '')  obj.name = new RegExp(params.search,'i');
     
        return ArticleModel
        .find(params.obj)
        .sort({_id:'descending'})
        .select('userName status odering crated content modified category.name thumb')
        .skip((params.paginaTion.currentPage-1)    *   params.paginaTion.totalperPage)
        .limit(params.paginaTion.totalperPage)
    },
    
    getItem : (id, options = null)=>{
       return ArticleModel.findById({_id:id});
    },
    countItem : (params,options = null)=>{
       return ArticleModel.countDocuments(params.obj);
    },
    changeStatus : (id,currentStatus = null)=>{
       
        let status        = (currentStatus === "active")    ?   "inactive"  :   "active";
        let data          = {
            status:status,
            modified: {
                user_id :   0,
                user_name: 0,
                time: Date.now()
            }
        }
        return  ArticleModel.updateOne({_id:   id},data);
     },
     changeACP : (id,options = null)=>{
        let UsersACP     = (currentUsers === "yes") ? "no": "yes";
        let data          = {
            group_acp:UsersACP,
            modified: {
                user_id :   0,
                user_name: "Assmin",
                time: Date.now()
            }
        }
       return ArticleModel.updateOne({_id:   id});
     },
    deleteItem : async  (id,options = null)=>{
       
        await ArticleModel.findById({_id:id}).then((item)=>{
            let path = FolderUpload + item.thumb;
            if(fs.existsSync(path)) fs.unlink(FolderUpload+ item.thumb,(err)=>{
                if(err){
                    throw err;
                }
            })
           
        });
     return ArticleModel.deleteOne({_id:   id});
     },
     saveItem : (item,options = null)=>{
     
            if(options.task == "add"){
                item.crated = {
                    user_id: 0,
                    user_name : "AssMin",
                    time: Date.now(),
                }
                item.category = {
                    id: item.category,
                    name: item.category_name,
                }
              return new ArticleModel(item).save(); 
              }
              if(options.task == "edit"){
                return ArticleModel.updateOne({_id: item.id},{
                     name:item.name,
                     ordering:parseInt(item.ordering),
                     slug:item.slug,
                     status: item.status,
                     content:item.content,
                     thumb : item.avatar,
                     category:{
                        id: item.category,
                        name: item.category_name,
                     },
                     modified: {
                         user_id: 0,
                         user_name : 0,
                         time: Date.now()
                     }
                     
                });
             
          }
         
        if(options.task == "changeCategoryName"){
                  
            return ArticleModel.updateOne({'category.id': item.id},{
                 category:{
                     id: item.id,
                     name: item.name,
                 },
              
             });   
        }
   }
}