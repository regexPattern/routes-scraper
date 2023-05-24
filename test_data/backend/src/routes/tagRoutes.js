const express = require("express");
const tagController = require("../controllers/tagController");

var wrapper = ({ query }) => {
  const router = express.Router();

  router.get("/tagindustries", (req, res) => {
    tagController.getTagIndustries(query, req, res);
  });

  router.get("/tagchildren/:parentId", (req, res) => {
    tagController.getTagChildren(query, req, res);
  });

  router.get("/tags", (_, res) => {
    tagController.getTags(query, res);
  });

  router.get("/tag/:tagId/terms", (req, res) => {
    tagController.getTagTerms(query, req, res);
  });

  router.get("/tagsummaries", (_, res) => {
    tagController.getTagSummaries(query, res);
  });

  router.get("/tagstermsalpha/:alpha", (req, res) => {
    tagController.getTagTermsByAlpha(query, req, res);
  });

  router.get("/tag/:tagId", (req, res) => {
    tagController.getTagById(query, req, res);
  });

  router.post("/tag", (req, res) => {
    tagController.updateTag(query, req, res);
  });

  router.put("/tag", (req, res) => {
    tagController.addTag(query, req, res);
  });

  router.post("/tagterm", (req, res) => {
    tagController.addTerm(query, req, res);
  });

  return router;
};

module.exports = wrapper;
