const Product = require("../models/Product");
const { mutipleMongooseToObject } = require("../../util/mongoose");

const tables = {
  A1: { id: 'A1' },
  A2: { id: 'A2' },
  // Thông tin về các bàn khác...
};

class HomeController {
  index(req, res, next) {
    const tableId = req.query.table; // Lấy mã bàn từ param table trong URL
    if (!tableId)
    {
      const user = req.session.user;
      Product.find({})
      .then((products) => {
        res.render("home", {
          products: mutipleMongooseToObject(products),
          user: user,
        });
      })
      .catch(next);
    }
    else{
      const table = tables[tableId]; // Lấy thông tin của bàn từ danh sách tables
      if (!table) {
          res.status(404).send('Không tìm thấy thông tin của bàn'); //
      } else {
          req.session.tableID = tableId;
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
