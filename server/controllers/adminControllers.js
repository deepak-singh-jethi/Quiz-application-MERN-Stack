// * admin controllers
const User = require("../Models/UserModel");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");

// create new instructors
exports.newInstructor = catchAsyncError(async (req, res, next) => {
  req.body.role = "instructor";
  const newInstructor = await User.create(req.body);

  res.status(200).json({
    message: "new Instructor Created",
    data: {
      newInstructor,
    },
  });
});

// delete user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.userId;
  const { password } = req.body;

  //  without password admin is not allowed to delete a user
  if (!password) {
    return next(new AppError("Password is required", 400));
  }

  //  get admin data from database
  const admin = await User.findById(req.user.id).select("+password");

  //  compare admin password with the given password
  if (!admin || !(await admin.isPasswordCorrect(password, admin.password))) {
    return next(new AppError("Invalid password", 401));
  }

  //  delete user
  const deletedUser = await User.findByIdAndDelete(userId);

  //  if user is not found with the give id
  if (!deletedUser) {
    return next(new AppError("User not found!", 404));
  }

  res.send({
    message: "User deleted",
    data: deletedUser,
  });
});

// update user
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.userId;

  // // * preventing password change from this route
  // if (req.body.password) {
  //   return next(
  //     new AppError("Password cannot be updated from this route", 400)
  //   );
  // }

  //  update user
  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });

  //  if user is not found with the give id
  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.send({
    message: "User updated",
    data: req.body,
    userId: userId,
  });
});
