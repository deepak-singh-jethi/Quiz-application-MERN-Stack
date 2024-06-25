const express = require("express");
const authController = require("../controllers/authControllers");
const quizController = require("../controllers/quizControllers");

const router = express.Router();

router.use(authController.protect);

// 1.! handling CURD of Quiz
router.get("", quizController.getAllQuiz);
router.get("/:id", quizController.getQuiz);
router.post("", quizController.createQuiz);
router.delete("/:id", quizController.deleteQuiz);
router.patch("/:id", quizController.updateQuiz);

// * restrict create update and delete quiz to admin
// router.use(authController.restrictTo("admin", "instructor"));

router.get(
  "/search/quiz",
  authController.restrictTo("admin", "instructor"),
  quizController.searchQuizzes
);

// * admin
router.get(
  "/admin/upcoming",
  authController.restrictTo("admin"),
  quizController.getAllUnPublishedQuiz
);
router.get(
  "/admin/published",
  authController.restrictTo("admin"),
  quizController.getReadyToUseQuizzes
);
router.get(
  "/admin/free",
  authController.restrictTo("admin"),
  quizController.getAllFreeQuiz
);

// * Instructor

router.get(
  "/instructor/published",
  authController.restrictTo("instructor", "admin"),
  quizController.getAllPublishedQuizByInstructor
);
router.get(
  "/instructor/upcoming",
  authController.restrictTo("instructor", "admin"),
  quizController.getAllUnPublishedQuizByInstructor
);

router.get(
  "/instructor/free",
  authController.restrictTo("instructor", "admin"),
  quizController.getAllFreeQuizByInstructor
);

module.exports = router;
