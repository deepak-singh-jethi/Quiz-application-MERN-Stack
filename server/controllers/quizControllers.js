const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const Quiz = require("../Models/QuizModel");
const User = require("../Models/UserModel");
const APIFeatures = require("../utils/APIFeatures");
const Question = require("../Models/QuestionModel");

// * create a quiz
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
    data: {
      quiz,
    },
  });
});

// * get a single quiz
exports.getQuiz = catchAsyncError(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate({
    path: "questions",
    select: "question options correctAnswer",
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

// * get quiz based on name
exports.searchQuizzes = catchAsyncError(async (req, res, next) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return next(
      new AppError("No search key provided or search key is empty", 400)
    );
  }

  // regex pattern for substring match
  const substringMatchPattern = new RegExp(`${name}`, "i");

  // Fetch quizzes that match any of the patterns
  const quizzes = await Quiz.find({
    name: { $regex: substringMatchPattern },
  })
    .select("name quizzes")
    .limit(5); // Limiting the number of results to 5

  // Separate quizzes into exact, prefix, and substring matches
  const exactMatches = [];
  const prefixMatches = [];
  const substringMatches = [];

  quizzes.forEach((quiz) => {
    if (quiz.name.toLowerCase() === name.toLowerCase()) {
      exactMatches.push(quiz);
    } else if (quiz.name.toLowerCase().startsWith(name.toLowerCase())) {
      prefixMatches.push(quiz);
    } else {
      substringMatches.push(quiz);
    }
  });

  // Combine results, ensuring exact matches come first, followed by prefix matches, and then substring matches
  const combinedQuizzes = [
    ...exactMatches,
    ...prefixMatches,
    ...substringMatches,
  ];

  res.status(200).json({
    status: "success",
    results: combinedQuizzes.length,
    data: {
      quizzes: combinedQuizzes,
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

// * get all quizzes which are free =>admin
exports.getAllFreeQuiz = catchAsyncError(async (req, res, next) => {
  const feature = new APIFeatures(
    Quiz.find({ isPublished: true, isFree: true }),
    req.query
  )
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

// * get all quizzes created => admin
exports.getReadyToUseQuizzes = catchAsyncError(async (req, res, next) => {
  const feature = new APIFeatures(
    Quiz.find({ createdBy: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const quiz = await feature.query.populate({
    path: "createdBy",
    select: "name",
  });

  res.status(200).json({
    status: "success",
    length: quiz.length,
    data: {
      quiz,
    },
  });
});

// * get All Draft Quizzes for admin
exports.getAllUnPublishedQuiz = catchAsyncError(async (req, res, next) => {
  const feature = new APIFeatures(Quiz.find({ isPublished: false }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const quiz = await feature.query.populate({
    path: "createdBy",
    select: "name",
  });

  res.status(200).json({
    status: "success",
    length: quiz.length,
    data: {
      quiz,
    },
  });
});

// * getAll quizzes which are published => instructor
exports.getAllPublishedQuizByInstructor = catchAsyncError(
  async (req, res, next) => {
    const feature = new APIFeatures(
      Quiz.find({ isPublished: true, createdBy: req.user.id }),
      req.query
    )
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
  }
);

// * get all draft quizzes => instructor
exports.getAllUnPublishedQuizByInstructor = catchAsyncError(
  async (req, res, next) => {
    const feature = new APIFeatures(
      Quiz.find({ isPublished: false, createdBy: req.user.id }),
      req.query
    )
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
  }
);

// * get all free quizzes => instructor
exports.getAllFreeQuizByInstructor = catchAsyncError(async (req, res, next) => {
  const feature = new APIFeatures(
    Quiz.find({ isPublished: true, isFree: true, createdBy: req.user.id }),
    req.query
  )
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

  // TODO delete all the questions related to the quiz

  // TODO delete all the results related to the quiz

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
