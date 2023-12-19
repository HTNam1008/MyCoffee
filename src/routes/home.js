const express = require("express");
const route = express.Router();

const homeController = require("../app/controllers/HomeController");

route.get('/', homeController.index);


route.get('/?table=1',homeController.index);
route.get('/',homeController.index);


module.exports=route;


