const express=require('express');
const route=express.Router();

const accountController=require('../app/controllers/AccountController');

route.get('/signout',accountController.signout);
route.post('/signin',accountController.check);
route.get('/signin',accountController.signin);

module.exports=route;