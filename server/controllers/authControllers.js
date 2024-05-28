const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../Models/UserModel");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");

// function to create jwt token

function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET);
}

// *  user controllers

// register for students
exports.register = catchAsyncError(async (req, res, next) => {
  req.body.role = "user";
  const newUser = await User.create(req.body);
  console.log(newUser);
  const token = createToken(newUser._id);
  res.status(200).json({
    message: "new user created!",
    status: "success",
    data: {
      user: newUser,
      token,
    },
  });
});

// * common controllers

// login
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //* check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  //* check if user exists

  const user = await User.findOne({ email }).select("+password");

  //* if user don't exist or password is incorrect
  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = createToken(user._id);

  res.status(200).json({
    message: "user logged in successfully",
    status: "success",
    data: {
      user,
      token,
    },
  });
});

// protection middleware
exports.protect = catchAsyncError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //* check if token exist
  if (!token) {
    return res.status(401).json({
      message: "you are not logged in! Please login first to get access",
    });
  }

  //* verify token and get user id

  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //* fetch user detail based on decoded id
  const fetchedUser = await User.findById(decodedData.id);

  if (!fetchedUser) {
    return res.status(401).json({
      message: "User Belonging to this token does not exist",
    });
  }

  //* attach the user detail to the req body
  req.user = fetchedUser;

  // todo check if user changed password after the token was issued

  next();
});

// restrict middleware  based on role
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //check role ['admin','user','instructor']

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
