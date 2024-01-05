const express=require('express');
const route=express.Router();
const EmployeeController=require('../app/controllers/EmployeeController');

const isAuthenticated=require('../app/middlewares/AuthenticateMiddleware');

route.put('/:id',EmployeeController.update);
route.get('/:id/edit',EmployeeController.edit);
route.get('/showOrders',EmployeeController.showOrders);
route.get('/create',EmployeeController.create);
route.post('/store',EmployeeController.store);
route.get('/homepage',isAuthenticated,EmployeeController.homepage);
route.delete('/:id',EmployeeController.destroy);

module.exports=route;