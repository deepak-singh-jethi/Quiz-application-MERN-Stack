const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question must have some text"],
      unique: [true, "This question already exists"],
    },
    options: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length === 4;
        },
        message: "Question must have 4 options",
      },
    },
    correctAnswer: {
      type: String,
      required: [true, "Question must have a correct answer"],
      validate: {
        validator: function (v) {
          return this.options.includes(v);
        },
        message: "Correct answer must be one of the options",
      },
    },
    topic: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
