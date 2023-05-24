const express = require("express");
const geoController = require("../controllers/geoController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/cities", auth0, (req, res) => {
    geoController.getAllCities(query, req, res);
  });

  router.get("/geosunlimited", auth0, (_, res) => {
    geoController.getAllCitiesUnlimited(query, res);
  });

  router.get("/city/:cityId", auth0, (req, res) => {
    geoController.getCityById(query, req, res);
  });

  router.get("/cities/:filter", auth0, (req, res) => {
    geoController.getfilteredCities(query, req, res);
  });

  router.post("/city", auth0, (req, res) => {
    geoController.updateCity(query, req, res);
  });

  router.post("/city/enabled", auth0, (req, res) => {
    geoController.updateCityEnabled(query, req, res);
  });

  router.get("/continentmetrics/:continent", (req, res) => {
    geoController.getContinentMetrics(query, req, res);
  });

  router.get("/industrymetrics/:industry", (req, res) => {
    geoController.getIndustryMetrics(query, req, res);
  });

  router.get("/states", auth0, (_, res) => {
    geoController.getAllStates(query, res);
  });

  router.post("/state", auth0, (req, res) => {
    geoController.updateState(query, req, res);
  });

  router.get("/state/:stateId", auth0, (req, res) => {
    geoController.getStateById(query, req, res);
  });

  router.get("/continentcountries/:continent", auth0, (req, res) => {
    geoController.getCountriesByContinent(query, req, res);
  });

  router.get("/countrystates/:countryId", auth0, (req, res) => {
    geoController.getStatesByCountry(query, req, res);
  });

  router.get("/statecounties/:stateId", auth0, (req, res) => {
    geoController.getCountiesByState(query, req, res);
  });

  router.get("/countycities/:county", auth0, (req, res) => {
    geoController.getCitiesByCounty(query, req, res);
  });

  router.get("/countries", auth0, (_, res) => {
    geoController.getAllCountries(query, res);
  });

  router.get("/country/:countryId", auth0, (req, res) => {
    geoController.getCountryById(query, req, res);
  });

  router.post("/country", auth0, (req, res) => {
    geoController.updateCountry(query, req, res);
  });

  router.get("/airports", auth0, (_, res) => {
    geoController.getAllAirports(query, res);
  });

  router.get("/airport/:airportId", auth0, (req, res) => {
    geoController.getAirportById(query, req, res);
  });

  router.post("/airport", auth0, (req, res) => {
    geoController.updateAirport(query, req, res);
  });

  router.get("/neighborhoods", auth0, (_, res) => {
    geoController.getAllNeighborhoods(query, res);
  });

  router.get("/neighborhoods/:cityId", auth0, (req, res) => {
    geoController.getCityNeighborhoods(query, req, res);
  });

  router.patch("/neighborhoods", auth0, (req, res) => {
    geoController.updateNeighborhoods(query, req, res);
  });

  router.post("/neighborhood", auth0, (req, res) => {
    geoController.updateNeighborhood(query, req, res);
  });

  router.patch("/geo/terms", auth0, (req, res) => {
    geoController.updateTerms(query, req, res);
  });

  return router;
};

module.exports = wrapper;
