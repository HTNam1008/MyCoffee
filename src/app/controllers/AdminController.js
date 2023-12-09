const Employee=require("../models/Employee");
const Product=require("../models/Product");
const Order=require("../models/Order");
const {mutipleMongooseToObject}=require('../../util/mongoose');
const { format } = require("morgan");



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
        const user=req.session.user;
        Order.find({})
        .then(orders=>{ 
            res.render('admin/orderHistory',{
                orders:mutipleMongooseToObject(orders)});
        })
        .catch(next); 

    }
    getDate(req, res, next) {
            const myDate = new Date(req.body.date);
            console.log(myDate)
            // let formattedDate = selectedDate.toISOString();
            const year = myDate.getFullYear();
            const month = String(myDate.getMonth() + 1).padStart(2, '0');
            const day = String(myDate.getDate()).padStart(2, '0');
            const hours = String(myDate.getHours()).padStart(2, '0');
            const minutes = String(myDate.getMinutes()).padStart(2, '0');
            const seconds = String(myDate.getSeconds()).padStart(2, '0');

            // Lấy thông tin về múi giờ (offset)
            const offset = myDate.getTimezoneOffset();
            const offsetHours = Math.floor(Math.abs(offset) / 60);
            const offsetMinutes = Math.abs(offset) % 60;
            const offsetSign = offset >= 0 ? '-' : '+';

            // Tạo chuỗi theo định dạng mong muốn
            const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

        
            console.log(formattedDate);

    
            Order.find({ date: formattedDate })
            .then(orders => {
                console.log(orders)
                res.render('admin/orderHistory',{
                orders:mutipleMongooseToObject(orders)})
            })
            .catch(next);
        }
    }

module.exports=new AdminController();