const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  age: Number,
});

const User_model = mongoose.model("user", userSchema); //here user is collection name;

module.exports = {
  User_model,
};
