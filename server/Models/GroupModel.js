const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Group must have a name"],
      unique: [true, "Group name must be unique"],
    },
    description: {
      type: String,
      required: [true, "Please Provide some description"],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    quizzes: [
      {
        _id: false,
        quiz: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Quiz",
        },
        scheduledFor: {
          type: Date,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    instructors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
