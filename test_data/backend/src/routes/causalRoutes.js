const express = require("express");
const causalController = require("../controllers/causalController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/meta/hierarchies", auth0, (_, res) => { causalController.getMetaHierarchies(query, res); });
  router.get("/meta/kpis", auth0, (_, res) => { causalController.getMetaKpis(query, res); });
  router.get("/meta/types", auth0, (_, res) => { causalController.getMetaTypes(query, res); });
  router.get("/test/name", auth0, (req, res) => { causalController.getTestByName(query, req, res); });
  router.get("/summaries/:testId", (req, res) => { causalController.getSummaries(query, req, res); });
  router.get("/daterange/:testId/:pre/:post", auth0, (req, res) => { causalController.getDateRange(query, req, res); });
  router.post("/results", auth0, (req, res) => { causalController.getResults(query, req, res); });
  router.post("/archivedresults", auth0, (req, res) => { causalController.getArchivedResults(query, req, res); });
  router.post("/test/parameters", auth0, (req, res) => { causalController.saveParameters(query, req, res); });
  router.get("/test/parameters/:testId", auth0, (req, res) => { causalController.getParametersById(query, req, res); });
  router.get("/test/results/:testId", auth0, (req, res) => { causalController.getResultsById(query, req, res); });
  router.get("/filters/:testId", auth0, (req, res) => { causalController.getChartFilters(query, req, res); });
  router.get("/chart/:testId", auth0, (req, res) => { causalController.getChartData(query, req, res); });
  router.get("/chartresults/:testId", auth0, (req, res) => { causalController.getChartDataResults(query, req, res); });
  router.post("/test/results", auth0, (req, res) => { causalController.saveResults(query, req, res); });
  router.post("/test/pctcomplete", auth0, (req, res) => { causalController.updatePctComplete(query, req, res); });
  router.post("/import", auth0, (req, res) => { causalController.importCausalInputs(query, req, res); });
  router.delete("/delete/:testId", auth0, (req, res) => { causalController.deleteCausalTest(query, req, res); });
  router.delete("/deleteinputs/:testId", auth0, (req, res) => { causalController.deleteCausalInputs(query, req, res); });
  router.delete("/archive/:testId", auth0, (req, res) => { causalController.archiveCausalTest(query, req, res); });
  router.get("/test/:testId/count", auth0, (req, res) => { causalController.getCausalInputsCount(query, req, res); });
  router.get("/test/:testId/inputs", auth0, (req, res) => { causalController.getCausalInputs(query, req, res); });

  return router;
};

module.exports = wrapper;
