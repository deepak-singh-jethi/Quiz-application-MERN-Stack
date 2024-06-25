const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const Quiz = require("../Models/QuizModel");
const User = require("../Models/UserModel");
const APIFeatures = require("../utils/APIFeatures");
const Question = require("../Models/QuestionModel");

//  * adding a new  questions both in question bank and quiz
exports.addQuestion = catchAsyncError(async (req, res, next) => {
  const quizId = req.params.quizId;
  const questions = req.body; // assuming questions is an array of question objects

  // Create multiple questions and get their IDs
  const createdQuestions = await Question.create(questions);
  const questionIds = createdQuestions.map((question) => question._id);

  // Find the quiz and update its questions array
  const quiz = await Quiz.findByIdAndUpdate(
    quizId,
    { $push: { questions: { $each: questionIds } } },
    { new: true, runValidators: true }
  );

  if (!quiz) {
    return next(new AppError("Quiz not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Questions Added Successfully",
    data: {
      quiz,
    },
  });
});

// * adding a existing question into the quiz
exports.addExistingQuestion = catchAsyncError(async (req, res, next) => {
  const quizId = req.params.quizId;
  const questionId = req.params.qusId;

  const qus = await Question.findById(questionId);

  if (!qus) {
    return next(new AppError("Question not found", 404));
  }

  // Find the quiz and update its questions array
  const quiz = await Quiz.findByIdAndUpdate(
    quizId,
    { $addToSet: { questions: questionId } }, // Use $addToSet instead of $push
    { new: true, runValidators: true }
  );

  if (!quiz) {
    return next(new AppError("Quiz not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Question Added Successfully",
    data: {
      quiz,
    },
  });
});

// * removing  a single existing question from a quiz
exports.removeExistingQuestion = catchAsyncError(async (req, res, next) => {
  const quizId = req.params.quizId;
  const questionId = req.params.qusId;

  // Find the quiz and remove the question from its questions array
  const quiz = await Quiz.findByIdAndUpdate(
    quizId,
    { $pull: { questions: questionId } },
    { new: true, runValidators: true }
  );

  if (!quiz) {
    return next(new AppError("Quiz not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Question Removed Successfully",
    data: {
      quiz,
    },
  });
});

// * updating question
exports.updateQuestion = catchAsyncError(async (req, res, next) => {
  const { question, options, correctAnswer } = req.body;

  if (options.length < 4) {
    return next(new AppError("Options must be 4", 400));
  }
  if (!options.includes(correctAnswer)) {
    return next(new AppError("Correct Answer must be one of the options", 400));
  }
  if (!question && question.trim() === "") {
    return next(new AppError("Question cannot be empty", 400));
  }
  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.qusId,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedQuestion) {
    return next(new AppError("Question not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Question Updated Successfully",
    data: {
      question: updatedQuestion,
    },
  });
});

// * deleting a question for a quiz only
exports.removeQuestion = catchAsyncError(async (req, res, next) => {
  const { quizId, qusId } = req.params;
  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    return next(new AppError("Quiz not found", 404));
  }
  if (!quiz.questions.includes(qusId)) {
    return next(new AppError("Question not found in the quiz", 404));
  }
  quiz.questions.pull(qusId);
  await quiz.save();
  res.status(200).json({
    status: "success",
    message: "Question Removed Successfully",
    data: {
      quiz,
    },
  });
});

// *  deleting a qus from a database
exports.deleteQuestion = catchAsyncError(async (req, res, next) => {
  const questionId = req.params.qusId;

  // option 1: Delete the question from the Question database
  const question = await Question.findByIdAndDelete(questionId);

  if (!question) {
    return next(new AppError("Question not found", 404));
  }

  // option=> don't delete question

  // Step 2: Remove the reference to the question from any exams that contain it
  await Quiz.updateMany(
    { questions: questionId },
    { $pull: { questions: questionId } }
  );

  res.status(200).json({
    status: "success",
    message: "Question Deleted Successfully",
    data: {
      question,
    },
  });
});

// * get a qus
exports.getQuestion = catchAsyncError(async (req, res, next) => {
  const question = await Question.findById(req.params.qusId);

  res.status(200).json({
    status: "success",
    message: "Question Found",
    data: {
      question,
    },
  });
});

// * get all qus
exports.getAllQuestions = catchAsyncError(async (req, res, next) => {
  let totalQus;
  if (req.query.topic) {
    totalQus = await Question.countDocuments({ topic: req.query.topic });
  } else {
    totalQus = await Question.countDocuments();
  }

  const feature = new APIFeatures(Question.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const questions = await feature.query;

  if (!questions) {
    return next(new AppError("No questions found with this topic", 404));
  }
  const limit = req.query.limit || 100;
  const page = req.query.page || 1;
  const hasNextPage = totalQus > page * limit;

  res.status(200).json({
    status: "success",

    data: {
      questions,
      hasNextPage,
      totalPage: Math.ceil(totalQus / limit),
    },
  });
});
