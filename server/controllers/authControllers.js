const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../Models/UserModel");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");

// function to create jwt token
async function createToken(id) {
  const user = await User.findById(id);

  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken,
  };
}

// * user controllers

// register for students
exports.register = catchAsyncError(async (req, res, next) => {
  req.body.role = "user";

  const newUser = await User.create(req.body);

  const { accessToken, refreshToken } = await createToken(newUser._id);

  const loggedInUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json({
      message: "new user created!",
      status: "success",
      data: {
        user: loggedInUser,
      },
    });
});

// * login
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  // if user don't exist or password is incorrect
  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const { accessToken, refreshToken } = await createToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json({
      message: "user logged in successfully",
      status: "success",
      data: {
        loggedInUser,
      },
    });
});

// * refresh token
exports.refreshToken = catchAsyncError(async (req, res, next) => {
  // get incoming refresh token from cookies or body

  const incomingRefreshToken = req.cookies.refreshToken;

  // check if token is present
  if (!incomingRefreshToken) {
    return next(new AppError("Unauthorized Request", 400));
  }

  // verify token
  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  // check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User no longer exists", 401));
  }

  //  check if incoming refresh token is same as database refresh token

  if (currentUser.refreshToken !== incomingRefreshToken) {
    return next(new AppError("Refresh token is expired or invalid", 401));
  }

  //   generate new access token
  const { accessToken, refreshToken } = await createToken(currentUser._id);

  //  set cookie

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json({
      message: "Refreshed successfully",
    });
});

// protection middleware
exports.protect = catchAsyncError(async (req, res, next) => {
  // * get token from cookies
  const token = req.cookies?.accessToken;

  // * check if token is present
  if (!token) {
    return next(new AppError("Unauthorized Request", 401));
  }

  // * verify token
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  // * check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("User no longer exists", 401));
  }

  // TODO  * 4) check if user changed password after the token was issued
  // if (currentUser.isPasswordChangedAfterTokenIssued(decoded.iat)) {
  //   return next(new AppError("User recently changed password", 401));
  // }

  // * grant access to protected route
  req.user = currentUser;
  next();
});

// restrict middleware based on role
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // check role ['admin', 'user', 'instructor']

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

// logout
exports.logout = catchAsyncError(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      refreshToken: null,
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json({ message: "Logged out successfully" });
});
