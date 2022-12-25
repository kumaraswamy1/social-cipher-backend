const Notification =require("../models/notification.model.js")

const getUserNotifications=async(req,res)=>{
  try{
      const populateQuery = [{path:'sender', select:'username _id imageUrl bio'}]
    const {user}=req;
    let notification =await Notification.find({
      sender:user._id}).populate(populateQuery)
    res.json({
      success:true,
      notification
    })

  }catch(err){
    res.json({
      succuess:false, message:'unable to fetch notifications . try again later',error:err.message
    })
  }
}


module.exports = { getUserNotifications}