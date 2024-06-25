const express = require("express");

const adminControllers = require("../controllers/adminControllers");
const authControllers = require("../controllers/authControllers");

const router = express.Router();

router.use(authControllers.protect);

router.use(authControllers.restrictTo("admin"));

router
  .route("/:userId")
  .patch(adminControllers.updateUser) // update a teachers info
  .delete(adminControllers.deleteUser); // delete a teacher

// Add a new teacher
router.route("/newInstructor").post(adminControllers.newInstructor);

module.exports = router;
