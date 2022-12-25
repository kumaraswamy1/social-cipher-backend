const Post = require('../models/post.model.js');
const Notification = require('../models/notification.model.js');
const getAllPosts = async (req, res) => {
  try {
    let posts = await Post.find({}).populate({
        path: "userId",
        select: " username bio imageUrl"
      })
    console.log(posts)
    res.json({ success: true, posts });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch posts.",
    });
  }
}

const addNewPosts = async (req, res) => {
  try {
    const { user } = req
    const { text } = req.body;
    console.log(text)
    let newPost = new Post({
      userId: user._id,
      text: text
    })
      ;
    await newPost.save();

    const post = await newPost
      .populate({
        path: "userId",
        select: "name username bio imageUrl"
      })

    res.json({ success: true, message: "Post added successfully.", post});
  } catch (err) {
    res.status(500).json({
      success: false, errorMessage: err.message,
      message: "Unable to add post.",
    });
  };
}



const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;
    console.log(postId)
    let post = await Post.findOne({ _id: postId });
    req.post = post
    next()
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to get post.",
    })
  }
}
const deletePost = async (req, res) => {
  try {
    let { post } = req
    post.remove();
    post = await post.save();
    res.json({ success: true, message: "Post deleted successfully." });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: err.message,
      message: "Unable to delete post.",
    })
  }
}

const updateLikes = async (req, res) => {
  try {
    const user = req.user
    let { post } = req

    if (post.likes.includes(user._id)) {
     post.likes.filter((userId) => userId != user._id);
      
    }
    else {
      post.likes.push(user._id)
        const notification = new Notification({
        sender: { _id:user._id},
        reciever: { _id: post.userId },
        action: "Liked",
        postId: { _id: post._id },
      });
     
 await notification.save();
    }

    await post.save();
    res.json({ success: true, post });

  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: err.message,
      message: "Unable to update like on this post.",
    });
  };
}

module.exports = { getAllPosts, addNewPosts, deletePost, getPostById, updateLikes }