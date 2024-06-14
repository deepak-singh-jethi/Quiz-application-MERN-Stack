const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const Group = require("../Models/GroupModel");
const User = require("../Models/UserModel");
const Quiz = require("../models/QuizModel");

const APIFeatures = require("../utils/APIFeatures");

// Create a new group
exports.createGroup = catchAsyncError(async (req, res, next) => {
  const id = req.user.id;
  const { name, description } = req.body;

  console.log(name, description);

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

// Get all groups with pagination and filtering
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
        path: "quizzes",
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
  const instructor = await User.findById(instructorId);

  if (!instructor) {
    return next(new AppError("Unauthorized access", 401));
  }

  // Get the total count of groups for pagination
  const totalGroups = await Group.countDocuments({
    instructors: { $in: instructorId },
  });

  console.log(totalGroups);

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
        path: "quizzes",
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

// * Get a single group by ID
exports.getGroup = catchAsyncError(async (req, res, next) => {
  const group = await Group.findById(req.params.id)
    .populate({
      path: "members",
      select: "name _id email ",
    })
    .populate({
      path: "quizzes",
      select: "name _id",
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

//  * Delete a group (soft delete by setting isDeleted to true)
exports.deleteGroup = catchAsyncError(async (req, res, next) => {
  const group = await Group.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Add a member to a group
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

// Remove a member from a group
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

// Add a quiz to a group
exports.addQuiz = catchAsyncError(async (req, res, next) => {
  const { groupId } = req.params;

  const { quizId } = req.body;

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
    group.quizzes.push(quizId);
  }

  await group.save();
  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// Remove a quiz from a group
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

  group.quizzes.pull(quizId);
  await group.save();
  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

//* add a instructor to a group
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
