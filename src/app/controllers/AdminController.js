const Employee=require("../models/Employee");
const Product=require("../models/Product");
const {mutipleMongooseToObject}=require('../../util/mongoose');

class AdminController{
    indexEmployees(req,res,next){
        Employee.find({})
        .then(employees=>{ 
            res.render('admin/showEmployees',{
                employees:mutipleMongooseToObject(employees)});
        })
        .catch(next); 

    }
    indexProducts(req,res,next){
        Product.find({})
        .then(products=>{ 
            res.render('admin/showProducts',{
                products:mutipleMongooseToObject(products)});
        })
        .catch(next); 

    }
}

module.exports=new AdminController();