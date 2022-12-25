const express = require("express");
const notificationRouter = express.Router();
const {
 getUserNotifications
} = require("../controllers/notification.controller.js");
const authentication = require("../middlewares/authentication.js");


notificationRouter
  .get('/', getUserNotifications)






module.exports = notificationRouter