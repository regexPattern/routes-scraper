const express = require("express");
const contractController = require("../controllers/contractController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/contract/:contractId/resources", (req, res) => {
    contractController.getContractResources(query, req, res);
  });

  router.delete("/contractresource/:contractResourceId", auth0, (req, res) => {
    contractController.deleteContractResources(query, req, res);
  });

  router.get("/contract/:contractId/trendsnew", auth0, (req, res) => {
    contractController.getContractTrendsNew(query, req, res);
  });

  router.get("/contract/:contractId/monthlypace", auth0, (req, res) => {
    contractController.getContractMonthlyPace(query, req, res);
  });

  router.get("/contract/:contractId/resourcesmonthlypace", auth0, (req, res) => {
    contractController.getContractResourcesMonthlyPace(query, req, res);
  });

  router.post("/contractresourcetype", auth0, (req, res) => {
    contractController.addContractResourceType(query, req, res);
  });

  router.post("/contractresource", auth0, (req, res) => {
    contractController.updateContractResource(query, req, res);
  });

  router.post("/contractresourcenotes", auth0, (req, res) => {
    contractController.updateContractResourceNotes(query, req, res);
  });

  router.post("/contractresourcehours", auth0, (req, res) => {
    contractController.updateContractResourceHours(query, req, res);
  });

  router.delete("/contractresource/:contractResourceId", auth0, (req, res) => {
    contractController.deleteContractResource(query, req, res);
  });

  return router;
};

module.exports = wrapper;
