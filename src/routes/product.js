const express=require('express');
const route=express.Router();
const courseController=require('../app/controllers/ProductController');

route.get('/:slug',courseController.show);

module.exports=route;
