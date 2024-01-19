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

    orderHistory(req, res, next) {
        const user = req.session.user;
        Order.find({})
            .populate('itemList')
            .then(async orders => {
                // Gửi danh sách sản phẩm và hàm asyncGetProductName đến template
                res.render('admin/orderHistory', {
                    orders: mutipleMongooseToObject(orders),
                    formatDate: formatDate,
                });
            })
            .catch(next);
    }

    reportRevenue(req,res, next) {
        const user = req.session.user;
        const labels=['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];
        const data=[10, 20, 30, 40, 50, 60];
        //const revenueDataString = JSON.stringify(data);
        
// Render template với dữ liệu doanh thu và các dữ liệu khác cần thiết
        res.render('admin/reportRevenue', {
            formatDate: formatDate,
            labels:labels,
            data: JSON.stringify(data)
        });
    }


    getDate(req, res, next) {
            const dateParts = (req.body.date).split('/');
    
            // Tạo đối tượng ngày giờ với các thành phần vừa phân tách
            const isoDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00.000Z`);
            Order.find({ createdAt: {
                $gte: new Date(isoDate),
                $lt: new Date(new Date(isoDate).getTime() + 24 * 60 * 60 * 1000)
            } })
            .populate('itemList')
            .then(orders => {
                
                res.render('admin/orderHistory',{
                orders:mutipleMongooseToObject(orders)})
            })
            .catch(next);
        }
    
    getRevenueDate(req, res, next) {
        const start = (req.body.startDate).split('-');
        const end=(req.body.endDate).split('-');

        // Tạo đối tượng ngày giờ với các thành phần vừa phân tách
        const isoDateStart = new Date(`${start[0]}-${start[1]}-${start[2]}T00:00:00.000Z`);
        const isoDateEnd = new Date(`${end[0]}-${end[1]}-${end[2]}T00:00:00.000Z`);
        const labels = [];
        let currentDate = new Date(isoDateStart);

        while (currentDate <= isoDateEnd) {
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            labels.push(`${year}/${month}/${day}`);

            currentDate.setDate(currentDate.getDate() + 1);
        }
        Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: isoDateStart,
                        $lt: new Date(new Date(isoDateEnd).getTime() + 24 * 60 * 60 * 1000)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    totalAmount: { $sum: "$total" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                    "_id.day": 1
                }
            },
        ])
        .then(data => {
            console.log(data);
            console.log(labels)
            const totalAmountsMap = {};
            data.forEach(item => {
                const year = item._id.year;
                const month = item._id.month.toString().padStart(2, '0');
                const day = item._id.day.toString().padStart(2, '0');
                const formattedDate = `${year}/${month}/${day}`;
                totalAmountsMap[formattedDate] = item.totalAmount;
            });
            
            // Lặp qua mảng labels và lấy ra totalAmounts tương ứng
            const totalAmounts = labels.map(label => totalAmountsMap[label] || 0);

            res.render('admin/reportRevenue', {
                data: JSON.stringify(totalAmounts),
                labels: labels
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

