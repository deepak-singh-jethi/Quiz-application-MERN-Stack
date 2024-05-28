const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");
const User = require("../Models/UserModel");
const Result = require("../Models/ResultModel");
const Question = require("../Models/QuestionModel");

// create a result for a quiz
exports.createResult = catchAsyncError(async (req, res, next) => {
  const quizId = req.params.quizId;
  const userId = req.user.id;
  const { answers } = req.body;

  if (!answers || answers.length === 0) {
    return next(new AppError("Answers cannot be empty", 400));
  }

  // Calculate score
  let score = 0;
  for (const answer of answers) {
    const question = await Question.findById(answer.question);
    if (!question) {
      return next(
        new AppError(`Question with ID ${answer.question} not found`, 404)
      );
    }
    if (question.correctAnswer === answer.selectedAns) {
      score++; // Increment score for each correct answer
    }
  }

  // Create a new result document
  const result = await Result.create({
    user: userId,
    quiz: quizId,
    answers,
    score, // Set the calculated score
  });

  res.status(200).json({
    status: "success",
    message: "Quiz submitted successfully",
    data: {
      result,
    },
  });
});

// get all results of a quiz
exports.getQuizResults = catchAsyncError(async (req, res, next) => {
  const quizId = req.params.quizId;

  const results = await Result.find({ quiz: quizId })
    .populate({
      path: "user",
      select: "name email",
    })
    .select("-quiz -answers -__v")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results,
  });
});

//  get all results of a user
exports.getUserResults = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;

  const results = await Result.find({ user: userId })
    .populate({
      path: "quiz",
      select: "name",
    })
    .select("-user -answers -__v")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results,
  });
});

// get quiz result stats
// TODO use aggregation pipeline to calculate stats for a quiz
exports.getQuizResultStats = catchAsyncError(async (req, res, next) => {});
