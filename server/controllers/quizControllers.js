const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const Quiz = require("../models/QuizModel");
const User = require("../Models/UserModel");
const APIFeatures = require("../utils/APIFeatures");
const Question = require("../Models/QuestionModel");

// create a quiz //!note => without qus
exports.createQuiz = catchAsyncError(async (req, res, next) => {
  const id = req.user.id;
  const { name, duration, perQusMarks, numberOfQus, topics } = req.body;
  const quiz = await Quiz.create({
    name,
    duration,
    perQusMarks,
    numberOfQus,
    createdBy: id,
    topics,
  });

  res.status(200).json({
    success: true,
    quiz,
  });
});

// * get a single quiz
exports.getQuiz = catchAsyncError(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate({
    path: "questions",
    select: "question options",
  });

  if (!quiz) {
    return next(new AppError("Quiz not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Quiz Found",
    data: {
      quiz,
    },
  });
});

// * get all quizzes for user
exports.getAllQuiz = catchAsyncError(async (req, res, next) => {
  const feature = new APIFeatures(Quiz.find({ isPublished: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const quiz = await feature.query;

  res.status(200).json({
    status: "success",
    length: quiz.length,
    data: {
      quiz,
    },
  });
});

// * get All unpublished Quizzes for admin

exports.getAllUnPublishedQuiz = catchAsyncError(async (req, res, next) => {
  const feature = new APIFeatures(Quiz.find({ isPublished: false }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const quiz = await feature.query;

  res.status(200).json({
    status: "success",
    length: quiz.length,
    data: {
      quiz,
    },
  });
});

// * update a quiz
exports.updateQuiz = catchAsyncError(async (req, res, next) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Quiz Updated Successfully",
    data: {
      quiz,
    },
  });
});

// * delete quiz
exports.deleteQuiz = catchAsyncError(async (req, res, next) => {
  // * without password admin is not allowed to delete a quiz
  const { password } = req.body;

  const quizId = req.params.id;

  if (!password) {
    return next(new AppError("Password is required", 400));
  }

  // * get admin data from database
  const admin = await User.findById(req.user.id).select("+password");

  // * compare admin password with the given password
  if (!admin || !(await admin.isPasswordCorrect(password, admin.password))) {
    return next(new AppError("Invalid password", 401));
  }

  const quiz = await Quiz.findByIdAndDelete(quizId);

  if (!quiz) {
    return next(new AppError("Quiz not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Quiz Deleted Successfully",
    data: {
      quiz,
    },
  });
});

// * middleware related to questions

//  * adding questions
exports.addQuestion = catchAsyncError(async (req, res, next) => {
  const quizId = req.params.quizId;
  const questions = req.body; // assuming questions is an array of question objects
  console.log(questions);

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

// * updating question
exports.updateQuestion = catchAsyncError(async (req, res, next) => {
  console.log(req.body);

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

  console.log(updatedQuestion);

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

// *  deleting a qus
exports.deleteQuestion = catchAsyncError(async (req, res, next) => {
  const questionId = req.params.qusId;
  console.log(questionId);

  // Step 1: Delete the question from the Question database
  const question = await Question.findByIdAndDelete(questionId);

  if (!question) {
    return next(new AppError("Question not found", 404));
  }

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
  console.log(req.params.qusId);

  res.status(200).json({
    status: "success",
    message: "Question Found",
    data: {
      question,
    },
  });
});
