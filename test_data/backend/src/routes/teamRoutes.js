const express = require("express");

const teamController = require("../controllers/teamController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/teamsummary/:year/:month", (req, res) => {
    teamController.getTeamSummary(query, req, res);
  });

  router.get("/teamresources/:year/:month", (req, res) => {
    teamController.getTeamResources(query, req, res);
  });

  router.get("/teamresources2/:year/:month", (req, res) => {
    teamController.getTeamResources2(query, req, res);
  });

  router.get("/teamresourcing/:team", (req, res) => {
    teamController.getTeamResourcing(query, req, res);
  });

  router.get("/teamforecast/:team/:year/:month/:scopeIds", (req, res) => {
    teamController.getTeamForecast(query, req, res);
  });

  return router;
};

module.exports = wrapper;
