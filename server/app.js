//package import
const express = require("express");
const cors = require("cors");
const cookies = require("cookie-parser");

// local imports
const groupRoutes = require("./routes/groupsRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const quizRoutes = require("./routes/quizRoutes");
const resultRoutes = require("./routes/resultRoute");

const AppError = require("./utils/AppError");
const errorController = require("./controllers/errorController");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

// serving the static files
app.use(express.static(`${__dirname}/public`));

// body parser => reading data from body into req.body
app.use(express.json());

// cookies api
app.use(cookies());

// * Routes
app.use("/api/v1/result", resultRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/group", groupRoutes);

// * Error handling => for undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`can't find the route named ${req.originalUrl}`, 400));
});

app.use(errorController);

module.exports = app;
