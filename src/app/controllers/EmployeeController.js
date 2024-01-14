const Employee=require("../models/Employee");
const Product=require("../models/Product");
const {mongoosesToObject}=require('../../util/mongoose');
const {mutipleMongooseToObject}=require('../../util/mongoose');
const bcrypt = require('bcrypt');
const saltRounds=10;

class EmployeeController{
    
    create(req,res,next){
        res.render("employees/create");
    }

    showOrders(req,res,next){
        
        const status=req.query.status;
        if (status){
            res.render("employees/orderList",{status:status});
        }
        else{
            res.render("employees/orderList",{status:"waiting"});
        }
        
    }


    async store(req,res,next){
        console.log(req.body);
        const formData=req.body;
        const newEmployee=new Employee(formData);
        newEmployee
           .save()
           .then(()=>res.redirect('/admin/showEmployees'))
           .catch((error)=>{
            console.log("Error:"+error);
           })
    }

    edit(req,res,next){
        Employee.findById(req.params.id)
           .then (employee => res.render('employees/edit',{
            employee: mongoosesToObject(employee)
           }))
           .catch(next);
    }

    //PUT 
    update(req,res,next){
        Employee.updateOne({_id:req.params.id},req.body)
          .then(()=>res.redirect('/admin/showEmployees'))
          .catch(next);
    }

    destroy(req,res,next){
        Employee.deleteOne({_id:req.params.id})
           .then(()=>res.redirect('back'))
           .catch(next)
    }

    homepage(req,res,next){
        const user=req.session.user;
        Product.find({})
        .then(products=>{ 
            res.render('home',{
                products:mutipleMongooseToObject(products),
                employee:user});
        })
        .catch(next); 

    }

}

module.exports=new EmployeeController();