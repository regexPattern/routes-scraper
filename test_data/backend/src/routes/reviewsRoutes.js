const express = require("express");
const reviewsController = require("../controllers/reviewsController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/reviews/passions", (_, res) => {
    reviewsController.getUserPassions(query, res);
  });

  router.get("/reviews/performances", (_, res) => {
    reviewsController.getPerformances(query, res);
  });

  router.get("/reviews", (req, res) => {
    reviewsController.getUser(query, req, res);
  });

  router.get("/reviews/:userId", (req, res) => {
    reviewsController.getUserObjectives(query, req, res);
  });

  router.get("/reviews/users/:managerId", (req, res) => {
    reviewsController.getUsers(query, req, res);
  });

  router.post("/reviews/user", auth0, (req, res) => {
    reviewsController.updateUserReview(query, req, res);
  });

  router.post("/reviews/objective/:reviewId", auth0, (req, res) => {
    reviewsController.updateUserObjective(query, req, res);
  });

  router.post("/reviews/performance/:reviewId", auth0, (req, res) => {
    reviewsController.updateUserPerformance(query, req, res);
  });

  router.post("/reviews/objectives/viewed", auth0, (req, res) => {
    reviewsController.updateUserViewed(query, req, res);
  });

  router.get("/library", (req, res) => {
    reviewsController.getResourcesByCategory(query, req, res);
  });

  return router;
};

module.exports = wrapper;
