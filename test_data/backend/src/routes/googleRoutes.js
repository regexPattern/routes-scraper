const express = require("express");
const googleController = require("../controllers/googleController");

var wrapper = ({ query }) => {
  const router = express.Router();

  router.get("/", async (_, res) => {
    return res.json({ message: "Google API" });
  });

  router.get("/clients", (req, res) => {
    googleController.getClients({ query, req, res });
  });

  router.post("/loadPlaces", (req, res) => {
    googleController.loadPlaces({
      query,
      req,
      res,
    });
  });

  router.post("/clients", (req, res) => {
    googleController.createClient({
      query,
      req,
      res,
    });
  });

  return router;
};

module.exports = wrapper;
