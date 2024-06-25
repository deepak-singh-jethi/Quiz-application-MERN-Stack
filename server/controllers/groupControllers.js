const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const Quiz = require("../Models/QuizModel");
const Group = require("../Models/GroupModel");
const User = require("../Models/UserModel");

const APIFeatures = require("../utils/APIFeatures");

// * Create a new group
exports.createGroup = catchAsyncError(async (req, res, next) => {
  const id = req.user.id;
  const { name, description } = req.body;

  if (!name || !description) {
    return next(
      new AppError("Name, description, and createdBy are required fields", 400)
    );
  }

  const group = await Group.create({
    name,
    description,
    createdBy: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: {
      group,
    },
  });
});

// * Get all groups with pagination and filtering
exports.getAllGroups = catchAsyncError(async (req, res, next) => {
  const features = new APIFeatures(
    Group.find()
      .populate({
        path: "createdBy",
        select: "name _id",
      })
      .populate({
        path: "members",
        select: "name _id",
      })
      .populate({
        path: "quizzes.quiz",
        select: "name _id",
      }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const totalGroups = await Group.countDocuments();
  const groups = await features.query;

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const hasNextPage = page * limit < totalGroups;

  res.status(200).json({
    status: "success",
    results: groups.length,
    data: {
      groups,
      hasNextPage,
    },
  });
});

// * get all groups of an instructor
exports.getGroupsByInstructor = catchAsyncError(async (req, res, next) => {
  const instructorId = req.user.id;

  // Ensure the user is an instructor
  const instructor = await User.findById(instructorId, { isDeleted: false });

  if (!instructor) {
    return next(new AppError("Unauthorized access", 401));
  }

  // Get the total count of groups for pagination
  const totalGroups = await Group.countDocuments({
    instructors: { $in: instructorId },
  });

  const features = new APIFeatures(
    Group.find({
      instructors: { $in: instructorId },
    })

      .populate({
        path: "createdBy",
        select: "name _id",
      })
      .populate({
        path: "members",
        select: "name _id",
      })
      .populate({
        path: "quizzes.quiz",
        select: "name _id",
      }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const groups = await features.query;

  // Calculate if there is a next page
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const hasNextPage = page * limit < totalGroups;

  res.status(200).json({
    status: "success1234",
    results: groups.length,
    data: {
      groups,
      hasNextPage, // Include this in the response
    },
  });
});

// * get all groups of a student

exports.getAllGroupsByStudent = catchAsyncError(async (req, res, next) => {
  const studentId = req.user.id;
  // find user
  const user = User.findById(studentId);

  // if user don't exist
  if (!user) {
    return next(new AppError("Unauthorized access", 401));
  }
  // find number of groups student exist
  const totalGroups = await Group.countDocuments({
    members: { $in: studentId },
  });

  // adding sorting filtering, limiting and pagination
  const features = new APIFeatures(
    Group.find({ members: { $in: studentId } })
      .populate({
        path: "createdBy",
        select: "name _id",
      })
      .populate({
        path: "members",
        select: "name _id",
      })
      .populate({
        path: "quizzes.quiz",
        select: "name _id",
      }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // calculating if user has next page of groups for pagination
  const groups = await features.query;
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const hasNextPage = page * limit < totalGroups;

  res.status(200).json({
    status: "success",
    results: groups.length,
    data: {
      groups,
      hasNextPage,
    },
  });
});

// * Get a single group by ID
exports.getGroup = catchAsyncError(async (req, res, next) => {
  const group = await Group.findById(req.params.id)
    .populate({
      path: "members",
      select: "name _id email ",
    })
    .populate({
      path: "quizzes.quiz",
      select: "name _id",
    })
    .populate({
      path: "instructors",
      select: "name _id email",
    });

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// * Update a group by ID
exports.updateGroup = catchAsyncError(async (req, res, next) => {
  const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("createdBy members quizzes");

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

//  * Delete or make active a group (soft delete by setting isDeleted to true)
exports.deleteGroup = catchAsyncError(async (req, res, next) => {
  // const group = await Group.findByIdAndUpdate(
  //   req.params.id,
  //   { isDeleted: true },
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );

  const group = await Group.findById(req.params.id);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }
  // if group is deleted
  if (group.isDeleted) {
    group.isDeleted = false; // make it active
  } else {
    group.isDeleted = true; // soft delete
  }
  await group.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// * Add a member to a group
exports.addStudent = catchAsyncError(async (req, res, next) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  if (!groupId || !userId) {
    return next(new AppError("Group ID and User ID are required", 400));
  }

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!group.members.includes(userId)) {
    group.members.push(userId);
  }

  await group.save();
  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// * Remove a member from a group
exports.removeMember = catchAsyncError(async (req, res, next) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  if (!groupId || !userId) {
    return next(new AppError("Group ID and User ID are required", 400));
  }

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  group.members.pull(userId);
  await group.save();
  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// * Add a quiz to a group
exports.addQuiz = catchAsyncError(async (req, res, next) => {
  const { groupId } = req.params;
  const { quizId, scheduledFor } = req.body;

  if (!groupId || !quizId) {
    return next(new AppError("Group ID and Quiz ID are required", 400));
  }

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    return next(new AppError("Quiz not found", 404));
  }

  if (!group.quizzes.includes(quizId)) {
    group.quizzes.push({ quiz: quizId, scheduledFor });
  }

  await group.save();
  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// * Remove a quiz from a group
exports.removeQuiz = catchAsyncError(async (req, res, next) => {
  const { groupId } = req.params;
  const { quizId } = req.body;

  if (!groupId || !quizId) {
    return next(new AppError("Group ID and Quiz ID are required", 400));
  }

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  group.quizzes.pull({ quiz: quizId });
  await group.save();
  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// * change schedule for a group quiz

exports.changeSchedule = catchAsyncError(async (req, res, next) => {
  const { groupId } = req.params;
  const { quizId, scheduledFor } = req.body;

  if (!groupId || !quizId || !scheduledFor) {
    return next(
      new AppError("Group ID, Quiz ID, and scheduledFor are required", 400)
    );
  }

  // Validate scheduledFor is a valid date
  if (isNaN(new Date(scheduledFor).getTime())) {
    return next(new AppError("Invalid date for scheduledFor", 400));
  }

  // Find the group by its ID
  const group = await Group.findById(groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  // Find the specific quiz in the group's quizzes array
  const quiz = group.quizzes.find((q) => q.quiz.toString() === quizId);

  if (!quiz) {
    return next(new AppError("Quiz not found in the group", 404));
  }

  // Update the scheduledFor field for the quiz
  quiz.scheduledFor = scheduledFor;

  // Save the changes to the group document
  await group.save();

  // Return success response
  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// *  add a instructor to a group
exports.addInstructor = catchAsyncError(async (req, res, next) => {
  const { groupId } = req.params;
  const { instructorId } = req.body;

  if (!groupId || !instructorId) {
    return next(new AppError("Group ID and Instructor ID are required", 400));
  }

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  const instructor = await User.findById(instructorId);

  if (!instructor) {
    return next(new AppError("Instructor not found", 404));
  }

  if (!group.instructors.includes(instructorId)) {
    group.instructors.push(instructorId);
  }
  await group.save();
  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// * remove a instructor from a group
exports.removeInstructor = catchAsyncError(async (req, res, next) => {
  const { groupId } = req.params;
  const { instructorId } = req.body;

  if (!groupId || !instructorId) {
    return next(new AppError("Group ID and Instructor ID are required", 400));
  }

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  group.instructors.pull(instructorId);
  await group.save();
  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});
