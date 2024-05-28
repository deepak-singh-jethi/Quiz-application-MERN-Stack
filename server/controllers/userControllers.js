const User = require("../Models/UserModel");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");

// * user controllers

// updateMe User
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

// deleteMe User
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

// * common controllers

// get user Details
exports.getUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).select("-__v -role");

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    message: "User Found",
    data: {
      user,
    },
  });
});

// get all users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  console.log(req.query);

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

// TODO update password

// TODO forgot password

// TODO reset password
