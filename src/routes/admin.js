const express = require("express");
const route = express.Router();

const adminController = require("../app/controllers/AdminController");
const isAuthenticated = require("../app/middlewares/AuthenticateMiddleware");

// Feedback
route.get("/feedback", isAuthenticated, adminController.feedback);
route.delete("/feedback/:id", isAuthenticated, adminController.hideFeedback);
route.post("/feedback", isAuthenticated, adminController.replyFeedback);


route.get('/showEmployees',isAuthenticated,adminController.indexEmployees);
route.get('/showProducts',isAuthenticated,adminController.indexProducts);
route.get('/homepage',isAuthenticated,adminController.homepage);
route.get('/orderHistory',isAuthenticated,adminController.orderHistory);
route.get('/reportRevenue',isAuthenticated, adminController.reportRevenue);
route.post('/getRevenueDate', adminController.getRevenueDate);

route.post('/getDate',adminController.getDate);
module.exports=route;


