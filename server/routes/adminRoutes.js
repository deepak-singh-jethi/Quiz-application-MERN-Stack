const express = require("express");

const adminControllers = require("../controllers/adminControllers");
const authControllers = require("../controllers/authControllers");

const router = express.Router();

router.use(authControllers.protect);

router.use(authControllers.restrictTo("admin"));

router
  .route("/:userId")
  .patch(adminControllers.updateUser)
  .delete(adminControllers.deleteUser);

router.route("/newInstructor").post(adminControllers.newInstructor);

module.exports = router;
