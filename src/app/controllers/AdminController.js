const Employee = require("../models/Employee");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Feedback = require("../models/Feedback");
const { mongoosesToObject } = require("../../util/mongoose");
const moment = require("moment");

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { filterFeedbacks } = require("../../util/filterFeedback");
const { format } = require("morgan");
const Handlebars = require("handlebars");

function formatDate(dateString) {
  if (!dateString) return "";
  return moment(dateString).utcOffset(7).format("DD/MM/YYYY HH:mm:ss");
}

Handlebars.registerHelper("formatDate", function (dateString) {
  if (!dateString) return "";
  return moment(dateString).utcOffset(7).format("DD/MM/YYYY HH:mm:ss");
});

class AdminController {
  indexEmployees(req, res, next) {
    const admin = req.session.user;
    Employee.find({})
      .then((employees) => {
        res.render("admin/showEmployees", {
          employees: mutipleMongooseToObject(employees),
          admin: admin,
        });
      })
      .catch(next);
  }
  indexProducts(req, res, next) {
    const user = req.session.user;
    Product.find({})
      .then((products) => {
        res.render("admin/showProducts", {
          products: mutipleMongooseToObject(products),
          admin: user,
        });
      })
      .catch(next);
  }
  homepage(req, res, next) {
    const user = req.session.user;
    Product.find({})
      .then((products) => {
        res.render("home", {
          products: mutipleMongooseToObject(products),
          admin: user,
        });
      })
      .catch(next);
  }

  orderHistory(req, res, next) {
    const user = req.session.user;
    Order.find({})
      .populate("itemList")
      .then(async (orders) => {
        // Gửi danh sách sản phẩm và hàm asyncGetProductName đến template
        res.render("admin/orderHistory", {
          orders: mutipleMongooseToObject(orders),
          formatDate: formatDate,
        });
      })
      .catch(next);
  }
  // orderHistory(req, res, next) {
  //     const user = req.session.user;
  //     console.log(Order.itemList);
  //     Order.find({})
  //         .populate('itemList')  // Sử dụng populate để lấy dữ liệu chi tiết của itemList
  //         .exec()
  //         .then(async orders => {
  //             // Giải quyết tất cả các Promise và lấy ra danh sách sản phẩm
  //             const resolvedOrders = await Promise.all(orders.map(async order => {
  //                 const resolvedItemList = await Promise.all(order.itemList.map(async item => {
  //                     const productName = await asyncGetProductName(item);
  //                     return productName;
  //                 }));
  //                 order.itemList = resolvedItemList;
  //                 return order;
  //             }));

  //             // Gửi danh sách sản phẩm đã giải quyết đến template
  //             res.render('admin/orderHistory', {
  //                 orders: mutipleMongooseToObject(resolvedOrders),
  //                 formatDate: formatDate,
  //             });
  //         })
  //         .catch(next);
  // }

  getDate(req, res, next) {
    const dateParts = req.body.date.split("/");

    // Tạo đối tượng ngày giờ với các thành phần vừa phân tách
    const isoDate = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00.000Z`
    );
    Order.find({
      createdAt: {
        $gte: new Date(isoDate),
        $lt: new Date(new Date(isoDate).getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .populate("itemList")
      .then((orders) => {
        res.render("admin/orderHistory", {
          orders: mutipleMongooseToObject(orders),
        });
      })
      .catch(next);
  }

  // Feedback
  feedback(req, res, next) {
    Feedback.find({})
      .then((feedbacks) => {
        res.render("feedback/showFeedbackEmployee", {
          feedbacks: filterFeedbacks(mutipleMongooseToObject(feedbacks)),
          admin: req.session.user,
        });
      })
      .catch(next);
  }

  hideFeedback(req, res, next) {
    Feedback.delete({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  replyFeedback(req, res, next) {
    const feedback = new Feedback({
      author: req.session.user.username,
      phone: req.session.user.sdt,
      feedback: req.body.feedback,
      image: null,
      replyID: req.body.id,
    });

    feedback
      .save()
      .then(() => res.redirect("/admin/feedback"))
      .catch((error) => console.log("Error:" + error));
  }
}

module.exports = new AdminController();
