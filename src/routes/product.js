const express=require('express');
const route=express.Router();
const courseController=require('../app/controllers/ProductController');
const ProductController = require('../app/controllers/ProductController');

route.get('/addProduct',ProductController.addProduct);
route.get('/:slug',courseController.show);

module.exports=route;
