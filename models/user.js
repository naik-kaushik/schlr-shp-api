const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  LastName: String,
  email: String,
  password: String,
});

// const User = mongoose.model("User", userSchema);

module.exports = {userSchema };
