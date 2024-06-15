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

// * get user Details
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

  console.log({ search }, { role });

  console.log(search, role);

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

// TODO update password

// TODO forgot password

// TODO reset password
