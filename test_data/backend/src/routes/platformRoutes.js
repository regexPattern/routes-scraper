const express = require("express");
const platformController = require("../controllers/platformController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/metrics/finance", auth0, (_, res) => {
    platformController.getDashboardFinance(query, res);
  });

  router.get("/metrics/teammates", auth0, (_, res) => {
    platformController.getDashboardTeammates(query, res);
  });

  router.get("/metrics/results", auth0, (_, res) => {
    platformController.getDashboardResults(query, res);
  });

  router.get("/metrics/features", auth0, (_, res) => {
    platformController.getDashboardFeatures(query, res);
  });

  router.get("/metrics/weli", auth0, (_, res) => {
    platformController.getDashboardWeli(query, res);
  });

  router.get("/metrics/client/:client/roi/:year", auth0, (req, res) => {
    platformController.getDashboardClientROI(query, req, res);
  });

  router.get("/metrics/sales", auth0, (_, res) => {
    platformController.getDashboardSales(query, res);
  });

  router.post("/metrics/sales", auth0, (req, res) => {
    platformController.updateDashboardSales(query, req, res);
  });

  router.post("/metrics/client", auth0, (req, res) => {
    platformController.updateDashboardClientROI(query, req, res);
  });

  router.get("/user/:userid/features", auth0, (req, res) => {
    platformController.getFeatures(query, req, res);
  });

  router.get("/user/:userid/shortcuts", auth0, (req, res) => {
    platformController.getShortcuts(query, req, res);
  });

  router.post("/user/:userid/shortcuts", auth0, (req, res) => {
    platformController.updateShortcuts(query, req, res);
  });

  router.get("/dashboard/links", auth0, (req, res) => {
    platformController.getDashboardLinks(query, req, res);
  });

  router.get("/metrics/clients", (_, res) => {
    platformController.getDashboardClients(query, res);
  });

  return router;
};

module.exports = wrapper;
