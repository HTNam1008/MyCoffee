const express = require("express");
const route = express.Router();
const EmployeeController = require("../app/controllers/EmployeeController");
const cartController = require("../app/controllers/CartController");

const isAuthenticated = require("../app/middlewares/AuthenticateMiddleware");

route.put("/:id", EmployeeController.update);
route.get("/:id/edit", EmployeeController.edit);
route.get("/showOrders", EmployeeController.showOrders);
route.get("/create", EmployeeController.create);
route.post("/store", EmployeeController.store);
route.get("/homepage", isAuthenticated, EmployeeController.homepage);
route.delete("/:id", EmployeeController.destroy);

// Feedback
route.get("/feedback", isAuthenticated, EmployeeController.feedback);
route.delete("/feedback/:id", isAuthenticated, EmployeeController.hideFeedback);
route.post("/feedback", isAuthenticated, EmployeeController.replyFeedback);
// Order
route.delete("/cart/:id", isAuthenticated, cartController.destroy);
route.put("/cart/:id/update", isAuthenticated, cartController.update);
route.post("/cart/order", isAuthenticated, cartController.orderEmployee);
route.get("/cart/show", isAuthenticated, cartController.show);
route.get("/cart/:id/edit", isAuthenticated, cartController.edit);

route.put("/:id", EmployeeController.update);
route.get("/:id/edit", EmployeeController.edit);
route.get("/create", EmployeeController.create);
route.post("/store", EmployeeController.store);
route.get("/homepage", isAuthenticated, EmployeeController.homepage);
route.delete("/:id", EmployeeController.destroy);

module.exports = route;
