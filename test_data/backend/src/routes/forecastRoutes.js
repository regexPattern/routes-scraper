const express = require("express");
const forecastController = require("../controllers/forecastController");

var wrapper = ({ query }) => {
  const router = express.Router();

  router.post("/forecasts", (req, res) => {
    forecastController.getAllForecasts(query, req, res);
  });

  router.post("/archivedforecasts", (req, res) => {
    forecastController.getArchivedForecasts(query, req, res);
  });

  router.get("/forecast/:forecastId", (req, res) => {
    forecastController.getForecastById(query, req, res);
  });

  router.get("/forecast/:forecastId/keywords", (req, res) => {
    forecastController.getForecastKeywords(query, req, res);
  });

  router.post("/forecast/import/keywordcount", (req, res) => {
    forecastController.updateForecastKeywordCount(query, req, res);
  });

  router.post("/forecast/import", (req, res) => {
    forecastController.importForecastKeywords(query, req, res);
  });

  router.post("/forecast/inputs", (req, res) => {
    forecastController.updateForecast(query, req, res);
  });

  router.delete("/forecast/:forecastId/keywords", (req, res) => {
    forecastController.deleteForecastKeywords(query, req, res);
  });

  router.delete("/forecast/archive/:forecastId", (req, res) => {
    forecastController.archiveForecast(query, req, res);
  });

  router.delete("/forecast/delete/:forecastId", (req, res) => {
    forecastController.deleteForecast(query, req, res);
  });

  router.post("/forecast/:forecastId/assumptions", (req, res) => {
    forecastController.updateForecastAssumptions(query, req, res);
  });

  return router;
};

module.exports = wrapper;
