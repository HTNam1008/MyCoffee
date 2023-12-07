const Employee=require("../models/Employee");
const Product=require("../models/Product");
const {mutipleMongooseToObject}=require('../../util/mongoose');



class AdminController{
    indexEmployees(req,res,next){
        const user=req.session.user;
        Employee.find({})
        .then(employees=>{ 
            res.render('admin/showEmployees',{
                employees:mutipleMongooseToObject(employees), user:user});
        })
        .catch(next); 

    }
    indexProducts(req,res,next){
        const user=req.session.user;
        Product.find({})
        .then(products=>{ 
            res.render('admin/showProducts',{
                products:mutipleMongooseToObject(products), user:user});
        })
        .catch(next); 

    }
    homepage(req,res,next){
        const user=req.session.user;
        Product.find({})
        .then(products=>{ 
            res.render('home',{
                products:mutipleMongooseToObject(products),
                user:user});
        })
        .catch(next); 

    }
    orderHistory(req,res,next){
        Product.find({})
        .then(products=>{ 
            res.render('admin/orderHistory',{
                products:mutipleMongooseToObject(products)});
        })
        .catch(next); 

    }
}

module.exports=new AdminController();