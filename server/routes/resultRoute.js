const express = require("express");
const authController = require("../controllers/authControllers");
const resultController = require("../controllers/resultControllers");

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo("admin", "user"));

router
  .route("/:quizId")
  .post(resultController.createResult)
  .get(resultController.getQuizResults);

router.route("/user/:userId").get(resultController.getAllUserResults);
router.route("/user/quiz/:quizId").get(resultController.getUserQuizResult);

module.exports = router;
