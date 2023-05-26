const express = require("express");
const roleController = require("../controllers/roleController");

var wrapper = ({ query }) => {
  const router = express.Router();
  router.post("/role/:role/users", (req, res) => {
    roleController.updateRoleResources(query, req, res);
  });

  router.get("/roles", (req, res) => {
    roleController.getRoles(query, req, res);
  });

  router.get("/role/:role/users", (req, res) => {
    roleController.getRoleResources(query, req, res);
  });

  router.post("/role", (req, res) => {
    roleController.updateRole(query, req, res);
  });

  return router;
};

module.exports = wrapper;
