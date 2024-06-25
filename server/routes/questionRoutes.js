const express = require("express");
const authController = require("../controllers/authControllers");
const quizController = require("../controllers/quizControllers");
const questionController = require("../controllers/questionControllers");

const router = express.Router();

router.use(authController.protect);

// get all questions
router.get("/search/All", questionController.getAllQuestions);

// handling the questions of a quiz
router
  .get("/:qusId", questionController.getQuestion)
  .post("/:quizId", questionController.addQuestion)
  .patch("/:qusId", questionController.updateQuestion)
  .delete("/:qusId", questionController.deleteQuestion);

router
  //remove a qus from a quiz
  .delete("/:quizId/:qusId", questionController.removeQuestion)
  // adding a existing question in question bank into a quiz
  .patch("/:quizId/:qusId", questionController.addExistingQuestion);

module.exports = router;
