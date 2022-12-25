const mongoose = require('mongoose');
const mySecret = process.env['mongoUrl']
const intialDbConnection = async () => {
  try {
    await mongoose.connect(mySecret, {
      useNewUrlParser: true,
  useUnifiedTopology: true,
    })
    console.log("db connected")
  }
  catch (error) {
    console.error(error);
  }
}

module.exports = { intialDbConnection }