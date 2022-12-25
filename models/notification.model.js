const mongoose = require('mongoose');
const { Schema } = mongoose

const notificationSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  reciever: { type: Schema.Types.ObjectId, ref: 'User' },
  action: {
    type: String,
    required: true
  },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
})

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
