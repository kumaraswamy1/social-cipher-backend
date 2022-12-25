const express = require("express");
const userRouter = express.Router();
const { registerUser, findUser, getUserById, updateFollowers, updateUser ,getAllUsers} = require("../controllers/user.controller.js");
const authentication = require("../middlewares/authentication.js");

userRouter
  .post('/signup', registerUser)
  .post('/login', findUser)

userRouter.use(authentication);
userRouter
  .get("/", getUserById)
  .get("/all",getAllUsers)
  .put("/edit", updateUser)
  .put("/follow", updateFollowers)

module.exports = userRouter