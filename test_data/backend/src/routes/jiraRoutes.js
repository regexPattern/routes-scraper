const express = require("express");
const jiraController = require("../controllers/jiraController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/issues", (_, res) => {
    jiraController.getAllIssues(res);
  });

  router.get("/versionedissues", (_, res) => {
    jiraController.getAllVersionedIssues(res);
  });

  router.get("/version", async (_, res) => {
    jiraController.getCurrentVersion(res);
  });

  router.put("/issue", auth0, (req, res) => {
    jiraController.insertIssue(req, res);
  });

  return router;
};

module.exports = wrapper;
