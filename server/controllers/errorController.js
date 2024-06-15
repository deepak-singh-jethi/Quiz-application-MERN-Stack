const AppError = require("../utils/AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateErrorDB = (err) => {
  console.log(err);
  const message = `${
    err.keyValue.name || err.keyValue.question || err.keyValue.email
  } Already exist🙂‍↔️`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  return new AppError("Invalid token. Please login Again", 401);
};

const handleTokenExpiredError = () => {
  return new AppError("Your token has expired. Please Login Again", 401);
};

const errorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const errorForProd = (err, res) => {
  if (err.operational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "DEV") {
    errorForDev(err, res);
  } else if (process.env.NODE_ENV === "PROD") {
    let error = Object.assign(err);
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    } else if (err.code === 11000) {
      error = handleDuplicateErrorDB(error);
    } else if (err.name === "ValidationError") {
      error = handleValidationError(error);
    } else if (err.name === "JsonWebTokenError") {
      error = handleJsonWebTokenError();
    } else if (err.name === "TokenExpiredError") {
      error = handleTokenExpiredError();
    }

    errorForProd(error, res);
  }
};

module.exports = errorController;
