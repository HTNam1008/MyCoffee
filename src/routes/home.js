const express=require('express');
const route=express.Router();


const homeController=require('../app/controllers/HomeController');

route.get('/',homeController.index);
route.post('/storeFeedback',homeController.storeFeedback);

module.exports=route;