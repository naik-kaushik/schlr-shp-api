const mongoose = require("mongoose");
const detailedUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  quizCreated: Number,
  quizzes: [
    {
      id: String,
    },
  ],
});

module.exports = mongoose.model("DetUser", detailedUserSchema);
