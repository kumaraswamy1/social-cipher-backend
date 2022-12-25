const { User } = require("../models/user.model.js")

const jwt = require('jsonwebtoken');

const secretKey = process.env['secretKey']



const authentication = async (req, res, next) => {

  try {
    let token = req.headers.authorization;
  
    if (!token) {
      return res
        .status(401)
        .json({
          success: false,
          errorMessage: "Unauthorized. Token not passed.",
        });
    }
    const decoded = jwt.verify(token, secretKey)
    const user = await User.findOne({ _id: decoded._id });
    req.user = { _id: user._id };
   
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "unauthorized token ", errorMessage: e.message })
  }

}

module.exports = authentication