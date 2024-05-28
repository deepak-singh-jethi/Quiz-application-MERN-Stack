//package import
const express = require("express");
const cors = require("cors");

// local imports
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const quizRoutes = require("./routes/quizRoutes");
const resultRoutes = require("./routes/resultRoute");

const AppError = require("./utils/AppError");
const errorController = require("./controllers/errorController");

const app = express();
app.use(cors());

// serving the static files
app.use(express.static(`${__dirname}/public`));

// body parser => reading data from body into req.body
app.use(express.json());

// * Routes

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/result", resultRoutes);

// * Error handling => for undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`can't find the route named ${req.originalUrl}`, 400));
});

app.use(errorController);

module.exports = app;
