const express = require("express");
const postRouter = express.Router();
const {
  getAllPosts, addNewPosts, deletePost, getPostById, updateLikes
} = require("../controllers/post.controller.js");
const authentication = require("../middlewares/authentication.js");


postRouter
  .post('/add', addNewPosts)
  .get('/', getAllPosts)


postRouter.param("postId", getPostById)

postRouter
  .put("/:postId", updateLikes)
  .delete("/:postId", deletePost)



module.exports = postRouter