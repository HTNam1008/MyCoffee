const express = require("express");
const route = express.Router();

const homeController = require("../app/controllers/HomeController");

route.get('/table', homeController.index);

module.exports = route;
