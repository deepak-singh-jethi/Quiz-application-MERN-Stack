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

    numberOfQus: {
      type: Number,
      required: [true, "Number of Questions Can't be empty"],
    },
    perQusMarks: {
      type: Number,
      required: [true, "Total Marks Can't be empty"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// middleWare to remove exams from search results if they are not published or deleted

QuizSchema.pre(/^find/, function (next) {
  this.find({ isPublished: true });

  next();
});

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
