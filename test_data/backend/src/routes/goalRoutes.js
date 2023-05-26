const express = require("express");
const goalController = require("../controllers/goalController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.post("/goal", auth0, (req, res) => {
    goalController.updateGoal(query, req, res);
  });

  router.delete("/goal/:goalId", auth0, (req, res) => {
    goalController.deleteGoal(query, req, res);
  });

  router.get("/department/:departmentId/goals/:year", auth0, (req, res) => {
    goalController.getDepartmentGoals(query, req, res);
  });

  router.post("/clientgoal", auth0, (req, res) => {
    goalController.updateClientGoal(query, req, res);
  });

  router.delete("/clientgoal/:goalId", auth0, (req, res) => {
    goalController.deleteClientGoal(query, req, res);
  });

  router.get("/client/:clientId/goals", (req, res) => {
    goalController.getApiGoals(query, req, res);
  });

  return router;
};

module.exports = wrapper;
