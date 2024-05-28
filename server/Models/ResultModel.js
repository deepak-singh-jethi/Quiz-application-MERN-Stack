const mongoose = require("mongoose");
const Question = require("./QuestionModel");

// Schema for answers within a result
const answers = new mongoose.Schema({
  question: {
    type: mongoose.Schema.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedAns: {
    type: String,
    required: true,
  },
});

// Schema for result
const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: "Quiz",
    required: true,
  },
  answers: {
    type: [answers],
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "Answers cannot be empty",
    },
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfAttempts: {
    type: Number,
    default: 1,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
