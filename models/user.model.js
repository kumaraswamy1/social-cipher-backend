const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: "Username cannot be empty",
      unique: "Username should be unique ",

    }, name: {
      type: String,
      required: "name cannot be empty",
    }, email: {
      type: String,
      unique: "This email id is already registered",
      required: "Email id cannot be empty"
    },
    password: {
      type: String,
      required: "Password cannot be empty"
    }, bio: { type: String },
    link: { type: String },
    imageUrl: {
      type: String,
      default: "https://i.ibb.co/b2fsM2B/blank-profile-pic.jpg"
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  }, { timestamps: true }
);

const User = mongoose.model("User", userSchema)

module.exports = { User }