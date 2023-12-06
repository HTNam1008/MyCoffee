const express=require('express');
const route=express.Router();

const adminController=require('../app/controllers/AdminController');


route.get('/showEmployees',adminController.indexEmployees);
route.get('/showProducts',adminController.indexProducts);

module.exports=route;