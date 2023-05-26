const express = require("express");
const analysisController = require("../controllers/analysisController");

var wrapper = ({ query }) => {
  const router = express.Router();

  router.get("/searches/:userid", (req, res) => {
    analysisController.getSearchs(query, req, res);
  });

  router.get("/search/:searchid", (req, res) => {
    analysisController.getSearchById(query, req, res);
  });

  router.post("/search", (req, res) => {
    analysisController.addSearch(query, req, res);
  });

  router.patch("/search", (req, res) => {
    analysisController.updateSearch(query, req, res);
  });

  router.delete("/search/:searchId", (req, res) => {
    analysisController.deleteSearch(query, req, res);
  });

  router.post("/tagsummary", (req, res) => {
    analysisController.getTagSummary(query, req, res);
  });

  router.post("/tagkeywords", (req, res) => {
    analysisController.getTagKeywords(query, req, res);
  });

  router.post("/geosummary", (req, res) => {
    analysisController.getGeoSummary(query, req, res);
  });

  router.post("/geokeywords", (req, res) => {
    analysisController.getGeoKeywords(query, req, res);
  });

  router.post("/syntaxsummary", (req, res) => {
    analysisController.getSyntaxSummary(query, req, res);
  });

  router.post("/syntaxkeywords", (req, res) => {
    analysisController.getSyntaxKeywords(query, req, res);
  });

  router.post("/searchusers", (req, res) => {
    analysisController.addSearchUsers(query, req, res);
  });

  return router;
};

module.exports = wrapper;
