const itemModel = require('./../schemas/items');
let createFillterStatus = (currentStatus) => {
    let statusFilter = [
        {name : 'All',value:'all',count:1,  link: '#',  class:'btn btn-default'},
        {name : 'Active',value:'active',count:2,  link: '#',  class:'btn btn-default'},
        {name : 'Inactive',value:'inactive',count:3,  link: '#',  class:'btn btn-default'},

    ];

    statusFilter.forEach((item,index)=>{
        let condition = {};
        if(item.value !== "all") condition = {status:item.value};
        if(item.value === currentStatus ) statusFilter[index].class='btn btn-success';
        itemModel.count({status : item.value }).then((data)=>{
            statusFilter[index].count   =   data;
         });
    });

    return statusFilter;
}
module.exports = {
    createFillterStatus : createFillterStatus
}