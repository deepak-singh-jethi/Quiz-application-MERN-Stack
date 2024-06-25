const User = require("../Models/UserModel");
const Group = require("../Models/GroupModel");
const Result = require("../Models/ResultModel");
const Quiz = require("../Models/QuizModel");

const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");

// * get self info
exports.getMe = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("-__v -refreshToken");

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    message: "User Found",
    data: {
      user,
    },
  });
});

// * updateMe User
exports.updateMe = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;

  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) return next(new AppError("User not found", 404));

  res.send({
    message: "User Updated Testing",
    data: {
      updatedUser,
    },
  });
});

// * deleteMe User
exports.deleteMe = catchAsyncError(async (req, res, next) => {
  // in place of deleting user, we can just set the isActive to false
  const userId = req.user.id;
  const user = await User.findByIdAndUpdate(userId, { isActive: false });

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      message: "Now your profile or all activities are not visible to others ",
    },
  });
});

//  * get all users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  // TODO add query filters

  res.status(202).json({
    message: "success",
    length: users.length,
    data: {
      users,
    },
  });
});

// * search user based on email or name
exports.searchUser = catchAsyncError(async (req, res, next) => {
  const { search, role } = req.query;

  if (!search || search.trim() === "") {
    return next(
      new AppError("No search key provided or search key is empty", 400)
    );
  }

  // regex pattern for the search term
  const searchPattern = new RegExp(search, "i");

  // Fetch users that match the search pattern in either name or email fields and have the role "user"

  const users = await User.find({
    $or: [
      { name: { $regex: searchPattern } },
      { email: { $regex: searchPattern } },
    ],
    role: role || "user",
  })
    .select(" name email")
    .limit(12);

  // Sort the users based on match type: exact match first, then prefix match
  users.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (aName === search.toLowerCase()) return -1; // Exact match comes first
    if (
      aName.startsWith(search.toLowerCase()) &&
      !bName.startsWith(search.toLowerCase())
    )
      return -1; // Prefix match comes next
    return 0;
  });

  if (!users || users.length === 0) {
    return next(new AppError("No matching users found", 404));
  }
  // return only 5 result
  const slicedUsers = users.slice(0, 5);

  res.status(200).json({
    message: "success",
    length: slicedUsers.length,
    data: {
      users: slicedUsers,
    },
  });
});

// * get all info about a instructor =>all  groups and  quizzes

exports.getInstructor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Fetch data concurrently
  const [instructor, groups, quizzes] = await Promise.all([
    User.findById(id).select("-__v -refreshToken -password"),
    Group.find({ instructors: { $in: id } }).select("name"),
    Quiz.find({ createdBy: id }).select("name"),
  ]);

  // Handle case where instructor is not found
  if (!instructor) {
    return next(new AppError("Instructor not found", 404));
  }

  // Respond with the data
  res.status(200).json({
    message: "success",
    data: {
      instructor,
      groups,
      quizzes,
    },
  });
});

// * get all info about a student => groups results of quizzes
exports.getStudent = catchAsyncError(async (req, res, next) => {
  const student = await User.findById(req.params.id);

  if (!student) return next(new AppError("Student not found", 404));

  // get all groups where student is part of
  const groups = await Group.find({ members: { $in: student._id } });
  // get all results of quizzes where student is the participant
  const results = await Result.find({ user: student._id });

  res.status(200).json({
    message: "success",
    data: {
      student,
      groups,
      results,
    },
  });
});

// TODO update password

// TODO forgot password

// TODO reset password
