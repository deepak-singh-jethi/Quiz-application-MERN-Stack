const express = require("express");
const authController = require("../controllers/authControllers");
const quizController = require("../controllers/quizControllers");

const router = express.Router();

router.use(authController.protect);

// 1.! handling CURD of Quiz
router.get("", quizController.getAllQuiz);
router.get("/:id", quizController.getQuiz);

// * restrict create update and delete quiz to admin
// router.use(authController.restrictTo("admin", "instructor"));

router.get(
  "/admin/upcoming",
  authController.restrictTo("admin"),
  quizController.getAllUnPublishedQuiz
);
router.get(
  "/admin/myPublished",
  authController.restrictTo("admin"),
  quizController.getMyCreatedQuizzes
);
router.get(
  "/instructor/published",
  authController.restrictTo("instructor", "admin"),
  quizController.getAllPublishedQuizByInstructor
);
router.get(
  "/instructor/unpublished",
  authController.restrictTo("instructor", "admin"),
  quizController.getAllUnPublishedQuizByInstructor
);

router.post("", quizController.createQuiz);
router.delete("/:id", quizController.deleteQuiz);
router.patch("/:id", quizController.updateQuiz);

// 2. handling the questions of a quiz
router.post("/questions/:quizId", quizController.addQuestion);
router.get("/questions/:qusId", quizController.getQuestion);
router.patch("/questions/:qusId", quizController.updateQuestion);
router.delete("/questions/:qusId", quizController.deleteQuestion);

module.exports = router;
