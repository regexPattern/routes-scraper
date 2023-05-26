const express = require("express");
const feedbackController = require("../controllers/feedbackController");

var wrapper = ({ query }) => {
  const router = express.Router();

  router.get("/feedback/questions", (_, res) => {
    feedbackController.getFeedbackQuestions(query, res);
  });

  router.put("/feedback/answers", (req, res) => {
    feedbackController.insertFeedbackAnswers(query, req, res);
  });

  router.put("/feedback/comments", (req, res) => {
    feedbackController.insertFeedbackComments(query, req, res);
  });

  router.get("/featurecaptain/:route", (req, res) => {
    feedbackController.getFeatureCaptain(query, req, res);
  });

  return router;
};

module.exports = wrapper;
