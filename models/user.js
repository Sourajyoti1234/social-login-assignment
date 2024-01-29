let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const userSchema = new Schema({
  id: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  username: {
    type: String,
    default: null,
  },

 name:{
  type: String,
  default: null
 },
  profilePhoto: String,
  source: {
    type: String,
    required: [true, "source not specified"]
  },
  lastVisited: {
    type: Date,
    default: new Date()
  }
});



const userModel = mongoose.model("user", userSchema, "user");
module.exports = userModel;