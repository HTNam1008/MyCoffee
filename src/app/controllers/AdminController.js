const Employee=require("../models/Employee");
const {mutipleMongooseToObject}=require('../../util/mongoose');

class AdminController{
    index(req,res,next){
        Employee.find({})
        .then(employees=>{ 
            res.render('admin/admin',{
                employees:mutipleMongooseToObject(employees)});
        })
        .catch(next); 

    }
}

module.exports=new AdminController();