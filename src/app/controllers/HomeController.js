const Product = require("../models/Product");
const { mutipleMongooseToObject } = require("../../util/mongoose");
const Table =require("../models/Table");
const Employee=require("../models/Employee")


class HomeController {
  async index(req, res, next) {
    var tables=await Table.find({});
    
    var tableList=[];
    for (var obj of tables){
      tableList.push(obj.noOfTable);
    } 
   
    
    const tableId = req.query.table; // Lấy mã bàn từ param table trong URL
  
    if (!tableId)
    {
        const user=req.session.user;
        var employee, admin;
        if (user){
            if (user.role=='admin'){
                admin=user;
                employee=null;
                
            }
            else if (user.role=='employee'){
                employee=user;
                admin=null;
            }
        }
        
        Product.find({})
        .then(products=>{ 
            res.render('home',{products:mutipleMongooseToObject(products), admin:admin, employee:employee});
        })
        .catch(next); 
    }
    else{
      if (!tableList.includes(parseInt(tableId))) {
          res.status(404).send('Không tìm thấy thông tin của bàn'); //
      } else {
          res.cookie('tableID',tableId,{maxAge:86400000, httpOnly:true });
          //console.log(table);
          Product.find({})
            .then((products) => {
              res.render("home", {
                products: mutipleMongooseToObject(products),
                tableID: tableId,
             });
            })
            .catch(next);
      }
  }
    
  }
}


module.exports = new HomeController();
