const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Quiz Name Can't be empty"],
      unique: [true, "Quiz Name already exist"],
    },
    questions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Question",
      },
    ],
    topics: [
      {
        type: String,
        trim: true,
      },
    ],

    duration: {
      type: Number,
      required: [true, "Duration Can't be empty"],
    },
    perQusMarks: {
      type: Number,
      required: [true, "Total Marks Can't be empty"],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    numberOfStudents: {
      type: Number,
      default: 0,
    },
    attemptedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

QuizSchema.index({ name: 1 });

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
