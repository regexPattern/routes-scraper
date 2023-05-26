const express = require("express");
const skillController = require("../controllers/skillController");

var wrapper = ({ query }) => {
  const router = express.Router();

  router.get("/skills", (req, res) => {
    skillController.getSkills(query, req, res);
  });

  router.get("/skill/:skill/users", (req, res) => {
    skillController.getSkillResources(query, req, res);
  });

  router.post("/skill", (req, res) => {
    skillController.updateSkill(query, req, res);
  });

  router.post("/skill/:skill/users", (req, res) => {
    skillController.updateSkillResources(query, req, res);
  });

  return router;
};

module.exports = wrapper;
