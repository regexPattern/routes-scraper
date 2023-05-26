const express = require("express");

const googleAnalyticsController = require("../controllers/googleAnalyticsController");

var wrapper = ({ query }) => {
  const router = express.Router();

  router.get("/gscsummary", (req, res) => {
    googleAnalyticsController.getGSCSummary(query, req, res);
  });

  router.get("/gasummary", (req, res) => {
    googleAnalyticsController.getGASummary(query, req, res);
  });

  router.get("/gasummarybydevice", (req, res) => {
    googleAnalyticsController.getGASummaryByDevice(query, req, res);
  });

  router.get("/gasummarybyuser", (req, res) => {
    googleAnalyticsController.getGASummaryByUser(query, req, res);
  });

  router.get("/lastrundate", (req, res) => {
    googleAnalyticsController.getApiLastRunDate(query, req, res);
  });

  router.get("/gscdates", (req, res) => {
    googleAnalyticsController.getGSCDates(query, req, res);
  });

  router.get("/configurations", (_, res) => {
    googleAnalyticsController.getApiConfigurations(query, res);
  });

  router.post("/loadgsc", (req, res) => {
    googleAnalyticsController.loadGSCSummary(query, req, res);
  });

  router.post("/loadga", (req, res) => {
    googleAnalytics.loadGASummary(query, req, res);
  });

  return router;
};

module.exports = wrapper;
