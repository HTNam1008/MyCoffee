const express = require("express");
const route = express.Router();
const SearchController = require("../app/controllers/SearchController");

route.get('/', SearchController.index);
module.exports=route;