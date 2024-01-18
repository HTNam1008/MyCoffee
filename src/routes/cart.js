const express=require('express');
const route=express.Router();

const cartController=require('../app/controllers/CartController');

route.delete('/:id',cartController.destroy);
route.put('/:id/update',cartController.update);
route.get('/order/:id',cartController.viewOrder);
route.post('/order',cartController.order);
route.get('/show',cartController.show);
route.get('/:id/edit',cartController.edit);

module.exports=route;