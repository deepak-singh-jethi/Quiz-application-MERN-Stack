const express = require("express");
const userControllers = require("../controllers/userControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

// common routes
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/refreshToken", authController.refreshToken);

router.use(authController.protect);

router.get("/getMe", userControllers.getMe);

router
  .route("/")
  .get(
    authController.restrictTo("admin", "instructor"),
    userControllers.getAllUsers
  );

router.get(
  "/instructor/:id",
  authController.restrictTo("admin", "instructor"),

  userControllers.getInstructor
);

// router.get("/user/:id", authController.restrictTo("admin", "instructor"));

router.post("/logout", authController.logout);

router.get(
  "/search/users",
  authController.restrictTo("admin", "instructor"),
  userControllers.searchUser
);

router.use(authController.restrictTo("user"));
router.patch("/updateMe", userControllers.updateMe);
router.delete("/deleteMe", userControllers.deleteMe);

// admin routes

module.exports = router;
