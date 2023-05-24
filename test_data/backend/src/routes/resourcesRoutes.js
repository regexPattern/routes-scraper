const express = require("express");
const resourcesController = require("../controllers/resourcesController");

var wrapper = ({ query }) => {
  const router = express.Router();

  router.get("", (_, res) => {
    resourcesController.getResources(query, res);
  });

  router.get("/billable", (_, res) => {
    resourcesController.getBillableResources(query, res);
  });

  router.get("/position/:contractId", (req, res) => {
    resourcesController.getBillablePositions(query, req, res);
  });

  router.get("/pacific", (_, res) => {
    resourcesController.getPacificResources(query, res);
  });

  return router;
};

module.exports = wrapper;
