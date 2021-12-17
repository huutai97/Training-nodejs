const itemModel = require('./../schemas/items');

module.exports = {
    listItems : (params,options = null )=>{
        let obj = {};
      
    if(params.currentStatus !=='all')   obj.status = params.currentStatus;
    if(params.search !== '')  obj.name = new RegExp(params.search,'i');
      
      return itemModel
        .find(obj)
        .sort({_id:'descending'})
        .select('name status ordering slug crated modified')
        .skip((params.paginaTion.currentPage-1)    *   params.paginaTion.totalperPage)
        .limit(params.paginaTion.totalperPage);
    },
    getItem : (slug)=>{
       return itemModel.findOne({slug:slug});
    },
    countItem : (params,options = null)=>{
       return itemModel.countDocuments(params.obj);
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
        return  itemModel.updateOne({_id:   id},data);
     },
    deleteItem : (id,options = null)=>{
     return itemModel.deleteOne({_id:   id});
     },
     saveItem : (item,options = null)=>{
     
            if(options.task == "add"){
                item.crated = {
                    user_id: 0,
                    user_name : "AssMin",
                    time: Date.now(),
                }
              return new itemModel(item).save();
              }
              if(options.task == "edit"){
              console.log(item.slug)

                return itemModel.updateOne({_id: item.id},{
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
                 });  
                 

        }
      
   }
}
