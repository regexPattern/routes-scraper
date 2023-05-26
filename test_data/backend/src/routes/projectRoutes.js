const express = require("express");
const projectController = require("../controllers/projectController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/project/:projectId", (req, res) => {
    projectController.getProjectById(query, req, res);
  });

  router.post("/project", auth0, (req, res) => {
    projectController.updateProject(query, req, res);
  });

  router.post("/newproject", auth0, (req, res) => {
    projectController.newProject(query, req, res);
  });

  router.post("/note", auth0, (req, res) => {
    projectController.updateNote(query, req, res);
  });

  return router;
};

module.exports = wrapper;
