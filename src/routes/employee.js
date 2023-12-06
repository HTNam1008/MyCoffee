const express=require('express');
const route=express.Router();
const EmployeeController=require('../app/controllers/EmployeeController');

route.put('/:id',EmployeeController.update);
route.get('/:id/edit',EmployeeController.edit);
route.get('/create',EmployeeController.create);
route.post('/store',EmployeeController.store);

route.delete('/:id',EmployeeController.destroy);

module.exports=route;