const express = require("express");
const reportController = require("../controllers/reportController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/priormetrics/:client", auth0, (req, res) => {
    reportController.getPriorMetrics(query, req, res);
  });

  router.get("/summarymetrics/:client", auth0, (req, res) => {
    reportController.getSummaryMetrics(query, req, res);
  });

  router.get("/trendmetrics/:client", auth0, (req, res) => {
    reportController.getTrendMetrics(query, req, res);
  });

  router.post("/seoperformance", (req, res) => {
    reportController.getSeoPerformance(query, req, res);
  });
  router.post("/prioritymetrics", (req, res) => {
    reportController.getPriorityMetrics(query, req, res);
  });

  return router;
};

module.exports = wrapper;
