const Product = require("../models/Product");
const { mutipleMongooseToObject } = require("../../util/mongoose");


class HomeController{
    
    index(req,res,next){
        const nTable=req.query.table;
        console.log(nTable);
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
}

const tables = {
  A1: { id: 'A1' },
  A2: { id: 'A2' },
  // Thông tin về các bàn khác...
};

class HomeController {
  index(req, res, next) {
    const tableId = req.query.table; // Lấy mã bàn từ param table trong URL
    const table = tables[tableId]; // Lấy thông tin của bàn từ danh sách tables

    if (!table) {
        res.status(404).send('Không tìm thấy thông tin của bàn');
    } else {
      //const user = req.session.user;
      Product.find({})
        .then((products) => {
          res.render("home", {
            products: mutipleMongooseToObject(products),});
            //user: user,
          //});
        })
        .catch(next);
    }
  }
}


module.exports = new HomeController();
