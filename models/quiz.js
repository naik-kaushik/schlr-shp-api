const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: String,
  instructions: String,
  author: String,
  questions: [
    {
      statement: String,
      opt1: String,
      opt2: String,
      opt3: String,
      opt4: String,
      ans: String,
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
