const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  statement: String,
  opt1: String,
  opt2: String,
  opt3: String,
  opt4: String,
  ans: String,
});
module.exports = mongoose.model("Question", questionSchema);
