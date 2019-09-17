const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const registerSchema = new Schema({
  username: String,
  pass: String,
  firstname: String,
  lastname: String,
  contact: String,
  dob: String,
  address: String,
  balance: Number
});

module.exports = mongoose.model("Register", registerSchema);
