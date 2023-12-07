const express=require('express');
const route=express.Router();

const adminController=require('../app/controllers/AdminController');
const isAuthenticated=require('../app/middlewares/AuthenticateMiddleware');



route.get('/showEmployees',isAuthenticated,adminController.indexEmployees);
route.get('/showProducts',isAuthenticated,adminController.indexProducts);
route.get('/homepageAdmin',isAuthenticated,adminController.homepage);
route.get('/orderHistory',adminController.orderHistory);
module.exports=route;