const express = require("express");
const otherController = require("../controllers/otherController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.post("/api/property", auth0, (req, res) => {
    otherController.updateProperty(query, req, res);
  });

  router.delete(
    "/api/scopedresource/:contractResourceId",
    auth0,
    (req, res) => {
      otherController.deleteScopedResources(query, req, res);
    }
  );

  router.get("/api/capacity/:resultType/:filter", auth0, (req, res) => {
    otherController.getCapacity(query, req, res);
  });

  router.get("/api/property/:apiPropertyId/filters", (req, res) => {
    otherController.getApiFilters(query, req, res);
  });

  router.get("/api/properties", (_, res) => {
    otherController.getApiProperties(query, res);
  });

  router.post("/api/property/import", auth0, (req, res) => {
    otherController.importClientFilters(query, req, res);
  });

  router.post("/api/deletefilters", auth0, (req, res) => {
    otherController.deleteClientFilters(query, req, res);
  });

  return router;
};

module.exports = wrapper;
