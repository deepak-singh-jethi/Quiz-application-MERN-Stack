const express = require("express");
const groupController = require("../controllers/groupControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// * Group routes
router
  .route("/")
  .get(authController.restrictTo("admin"), groupController.getAllGroups) // Get all groups for admin
  .post(authController.restrictTo("admin"), groupController.createGroup); // Create a new group

router
  .route("/:id")
  .get(groupController.getGroup) // Get a single group by ID from admin user teacher
  .patch(authController.restrictTo("admin"), groupController.updateGroup) // Update a group by ID
  .delete(authController.restrictTo("admin"), groupController.deleteGroup); // Soft delete a group by ID

// * Routes for managing members
router
  .route("/:groupId/members")
  .post(
    authController.restrictTo("admin", "instructor"),
    groupController.addStudent // Add a member to a group
  )
  .delete(
    authController.restrictTo("admin", "instructor"),
    groupController.removeMember // Remove a member from a group
  );

// * Routes for managing quizzes
router
  .route("/:groupId/quizzes")
  .post(
    authController.restrictTo("admin", "instructor"),
    groupController.addQuiz
  ) // Add a quiz to a group
  .delete(
    authController.restrictTo("admin", "instructor"),
    groupController.removeQuiz // Remove a quiz from a group
  );

//* routes for adding instructor or get all quizzes for a instructor

router
  .route("/admin/instructor/:groupId")
  .post(
    authController.restrictTo("admin"),
    groupController.addInstructor // add instructor for group
  )
  .delete(authController.restrictTo("admin"), groupController.removeInstructor);

router.get(
  "/instructor/all",
  authController.restrictTo("admin", "instructor"),
  groupController.getGroupsByInstructor //get all the quiz where instructor is a part
);

module.exports = router;
