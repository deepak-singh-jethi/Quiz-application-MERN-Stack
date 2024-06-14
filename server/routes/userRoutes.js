const express = require("express");
const userControllers = require("../controllers/userControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

// common routes
router.post("/login", authController.login);
router.post("/register", authController.register);

// protect and restrict middleware => only verified users can access these routes
router.use(authController.protect);

// verified admin , users can get all users
router
  .route("/")
  .get(
    authController.restrictTo("admin", "instructor"),
    userControllers.getAllUsers
  );

// verified admin , users can get users info
router.get("/:userId", userControllers.getUser);

router.get(
  "/search/users",
  authController.restrictTo("admin", "instructor"),
  userControllers.searchUser
);

// only user can update and delete
router.use(authController.restrictTo("user"));

router.patch("/updateMe", userControllers.updateMe);
router.delete("/deleteMe", userControllers.deleteMe);

// admin routes

module.exports = router;
