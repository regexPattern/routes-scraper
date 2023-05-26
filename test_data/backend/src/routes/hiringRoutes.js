const express = require("express");
const hiringController = require("../controllers/hiringController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/scenarios/:userid/:teamid", (req, res) => {
    hiringController.getHiringScenarios(query, req, res);
  });

  router.get("/resources/:scenarioid", (req, res) => {
    hiringController.getHiringResources(query, req, res);
  });

  router.post("/scenario", (req, res) => {
    hiringController.saveHiringScenario(query, req, res);
  });

  router.delete("/scenario/:scenarioId", auth0, (req, res) => {
    hiringController.deleteHiringScenario(query, req, res);
  });

  return router;
};

module.exports = wrapper;
