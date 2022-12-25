const { User } = require("../models/user.model.js")
const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const secretKey = process.env['secretKey']
const { extend } = require("lodash");

const Notification = require('../models/notification.model.js');

const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body.user;
  if (!(email && password)) {
    return res.status(400).send({ error: "Data not formatted properly" });
  }
  const oldUser = await User.findOne({ email: email.toLowerCase() });
  if (oldUser) {
    return res.status(409).send("User Already Exist. Please Login");
  }
  else {
    const salt = await bcrypt.genSalt(10);
    const passwordEncrypted = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      name,
      email: email.toLowerCase(),
      password: passwordEncrypted
    });
    return res.json({ success: true, username: username });
  }
}




const findUser = async (req, res) => {
  const { username, password } = req.body
  if (!(username && password)) {
    res.status(400).send("All input is required");
  }
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ _id: user._id, username: user.username }, secretKey, { expiresIn: "24h" })
    res.json({ success: true, token })

  } else {
    res.status(401).json({
      success: false,
      message: "Username or password is incorrect",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = req.user;

   let userId = await User.findOne({_id: user._id });
      userId.password = undefined;
    res.json({success: true,user: userId })
  }
  catch (err) {
    res.status(500).json({ success: false, message: "user not found", errorMessage: err.message })
  }
}

const getAllUsers = async (req, res) => {
  try {
  const populateQuery = [{path:'followers', select:'username _id imageUrl bio'}, {path:'following', select:'username _id imageUrl bio'}];
    let users= await User.find({}).populate()
 
    res.json({ success: true, users });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch users.",errorMessage: err.message
    });
  }
}

const updateUser = async (req, res) => {
try{
  let {user}=req
  const {userDetails}=req.body
  console.log({userDetails})
     user= await User.findOne({_id: user._id });
  user=extend(user, userDetails)
     await user.save();
  
  res.json({success: true, message: "Profile updated successfully",user})
  
}catch(err){
  res.status(500).json({ success: false, message: "user not found. profile update failed", errorMessage: err.message })
}}


  const updateFollowers = async (req, res) => {
    try{
      let {user}=req
    const {viewerId}=req.body
      console.log({viewerId})
     user = await User.findById({_id:user._id})
    let viewer = await User.findById({_id:viewerId})
console.log({viewer})
if (
      user.following.includes(viewer._id)&&
      viewer.followers.includes(user._id)
    )
{
  user.following.pull(viewer._id);
  viewer.followers.pull(user._id);
   let notification = new Notification({
      sender: { _id: user._id},
      reciever: { _id: viewer._id},
      action: "Unfollowed",
    });
  await notification.save();
  
}
    else{ 
      user.following.push(viewer._id)
    viewer.followers.push(user._id)
         let notification = new Notification({
      sender: { _id: user._id},
      reciever: { _id: viewer._id},
      action: "Unfollowed",
    });
  await notification.save();
    }
   
    viewer=await viewer.save();
    user=await user.save();
res.json({success: true,user,viewer})
  }
  catch(err){
    res.status(500).json({ success: false, message: "Unable to update user followers/following", errorMessage: err.message })
  }
  }
module.exports = { registerUser, findUser, getUserById ,updateFollowers,updateUser,getAllUsers}