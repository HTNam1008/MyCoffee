const Employee = require("../models/Employee");
const Product = require("../models/Product");
const Feedback = require("../models/Feedback");
const { mongoosesToObject } = require("../../util/mongoose");
const { mutipleMongooseToObject } = require("../../util/mongoose");
const { filterFeedbacks } = require("../../util/filterFeedback");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class EmployeeController {
  create(req, res, next) {
    res.render("employees/create");
  }

  async store(req, res, next) {
    console.log(req.body);
    const formData = req.body;
    const newEmployee = new Employee(formData);
    newEmployee
      .save()
      .then(() => res.redirect("/admin/showEmployees"))
      .catch((error) => {
        console.log("Error:" + error);
      });
  }

  edit(req, res, next) {
    Employee.findById(req.params.id)
      .then((employee) =>
        res.render("employees/edit", {
          employee: mongoosesToObject(employee),
        })
      )
      .catch(next);
  }

  //PUT
  update(req, res, next) {
    Employee.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/admin/showEmployees"))
      .catch(next);
  }

  destroy(req, res, next) {
    Employee.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  feedback(req, res, next) {
    Feedback.find({})
      .then((feedbacks) => {
        res.render("feedback/showFeedbackEmployee", {
          feedbacks: filterFeedbacks(mutipleMongooseToObject(feedbacks)),
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
      .then(() => res.redirect("/employees/feedback"))
      .catch((error) => console.log("Error:" + error));
  }

  homepage(req, res, next) {
    const user = req.session.user;
    Product.find({})
      .then((products) => {
        res.render("home", {
          products: mutipleMongooseToObject(products),
          employee: user,
        });
      })
      .catch(next);
  }
}

module.exports = new EmployeeController();
