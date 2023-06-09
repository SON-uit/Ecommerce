const express = require("express");

const route = express.Router();
const authController = require("../controllers/authControllers");

route.post("/signUp", authController.signUp);
route.post("/logIn", authController.logIn);
route.post("/logout", authController.logout);
module.exports = route;
