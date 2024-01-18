const Product = require("../models/Product");
const OrderDetail = require("../models/OrderDetail");
const Order = require("../models/Order");
const slugify = require("slugify");
const { mongoosesToObject } = require("../../util/mongoose");
const { mutipleMongooseToObject } = require("../../util/mongoose");

class CartController {
  show(req, res, next) {
    // OrderDetail.find({tableId: req.cookies.tableID, isOrdered: false})
    // .then(orders=>{
    //     req.session.orders=orders;
    //     res.cookie('orders',mutipleMongooseToObject(orders),{maxAge:86400000, httpOnly:true });
    //     var totalCost=0;
    //     for (var obj of orders){
    //         totalCost+=obj.total;
    //     }
    //     res.render('cart/show',{orders:mutipleMongooseToObject(orders), total: totalCost, discount: 0})
    // })
    // .catch(next);

    if (!req.cookies.orders) {
      res.render("cart/show", {
        total: 0,
        discount: 0,
        employee: req.session.user,
      });
    } else {
      const ordersList = req.cookies.orders;
      const realOrder = [];
      var totalCost = 0;
      var count = 0;
      // Mảng để lưu thông tin về các order từ bảng OrderDetail
      const orderDetails = [];
      // Lặp qua mỗi _id trong ordersList
      for (const orderId of ordersList) {
        // Tìm order trong bảng OrderDetail với _id tương ứng
        OrderDetail.findById(orderId)
          .then((orderDetail) => {
            count += 1;
            // Kiểm tra xem orderDetail có tồn tại hay không
            if (orderDetail && orderDetail.tableId == req.cookies.tableID) {
              realOrder.push(orderId);
              orderDetails.push(orderDetail);
              // Tính tổng chi phí
              totalCost += orderDetail.total;
              console.log(orderDetails);
            }
            if (count === ordersList.length) {
              // Gửi response khi đã hoàn thành lặp
              res.cookie("orders", realOrder, {
                maxAge: 86400000,
                httpOnly: true,
              });
              res.render("cart/show", {
                orders: mutipleMongooseToObject(orderDetails),
                total: totalCost,
                discount: 0,
                employee: req.session.user,
              });
            }
          })
          .catch((error) => {
            console.error("Error finding order in OrderDetail:", error);
            res.status(500).send("Internal Server Error");
          });
      }
      //res.render('cart/show', { orders: mutipleMongooseToObject(orderDetails), total: totalCost, discount: 0 });
    }
  }

  order(req, res, next) {
    const formData = req.body;
    const itemList = req.cookies.orders;
    var itemIds = [];
    for (var obj of itemList) {
      itemIds.push(obj);
      OrderDetail.findById(obj)
        .then((order) => {
          if (order.tableId == req.cookies.tableID) order.isOrdered = true;
          return order.save();
        })
        .then((updatedOrder) => {})
        .catch();
    }
    const newOrder = new Order({
      tableId: req.cookies.tableID,
      itemList: itemIds,
      amount: formData.total,
      discount: formData.discount,
      total: formData.totalCost,
      note: formData.note,
      status: "waiting",
      employee: "",
    });

    newOrder
      .save()
      //   .then(()=>{
      //     for (var obj of itemList){
      //         console.log(obj._id);
      //         OrderDetail.deleteOne({_id:obj._id})
      //         .then()
      //         .catch(next)
      //     }
      //   })
      .then((order) => {
        req.session.yourOrder = mongoosesToObject(order);
        res.cookie("yourOrder", mongoosesToObject(order), {
          maxAge: 86400000,
          httpOnly: true,
        });
        res.clearCookie("orders");
        res.redirect("/cart/order/wait");
      })
      .catch((error) => console.log("Error:" + error));
  }

  orderEmployee(req, res, next) {
    const formData = req.body;
    const itemList = req.cookies.orders;
    var itemIds = [];
    for (var obj of itemList) {
      itemIds.push(obj);
      OrderDetail.findById(obj)
        .then((order) => {
          if (order.tableId == req.cookies.tableID) order.isOrdered = true;
          return order.save();
        })
        .then((updatedOrder) => {})
        .catch();
    }
    const newOrder = new Order({
      tableId: 0,
      itemList: itemIds,
      amount: formData.total,
      discount: formData.discount,
      total: formData.totalCost,
      note: formData.note,
      status: "done",
      employee: "",
    });

    newOrder
      .save()
      .then((order) => {
        req.session.yourOrder = mongoosesToObject(order);
        res.cookie("yourOrder", mongoosesToObject(order), {
          maxAge: 86400000,
          httpOnly: true,
        });
        res.clearCookie("orders");
        res.redirect("/employees/homepage");
      })
      .catch((error) => console.log("Error:" + error));
  }

  edit(req, res, next) {
    OrderDetail.findById(req.params.id)
      .then((order) => {
        Product.findById(order.productId)
          .then((product) =>
            res.render("cart/editOrder", {
              product: mongoosesToObject(product),
              order: mongoosesToObject(order),
              employee: req.session.user,
            })
          )
          .catch(next);
      })
      .catch(next);
  }

  update(req, res, next) {
    const formData = req.body;
    OrderDetail.findById(req.params.id).then((order) => {
      Product.findById(order.productId)
        .then((product) => {
          var productPrice = product.price;
          var size = formData.size;
          var icePercent = formData.ice;
          var sugarPercent = formData.sugar;
          const extra = formData.topping;
          var amount = productPrice;
          var quantity = formData.quantity;
          for (const i of extra) {
            if (i == "tranchau") {
              amount += 8000;
            }
            if (i == "banhplan") {
              amount += 7000;
            }
            if (i == "thach") {
              amount += 5000;
            }
          }
          var total = amount * quantity;
          const temp = {
            size,
            icePercent,
            sugarPercent,
            extra,
            amount,
            quantity,
            total,
          };
          OrderDetail.updateOne({ _id: req.params.id }, temp)
            .then(() =>
              req.session.user
                ? res.redirect("/employees/cart/show")
                : res.redirect("/cart/show")
            )
            .catch(next);
        })
        .catch(next);
    });
  }

  destroy(req, res, next) {
    const currentOrders = req.cookies.orders;
    for (let i = 0; i < currentOrders.length; i++) {
      if (currentOrders[i] === req.params.id) {
        // Nếu _id trùng khớp, xóa đối tượng khỏi mảng
        currentOrders.splice(i, 1);
        break; // Thoát khỏi vòng lặp vì đã tìm thấy và xóa
      }
    }
    res.cookie("orders", currentOrders, { maxAge: 86400000, httpOnly: true });

    OrderDetail.delete({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
}

module.exports = new CartController();
