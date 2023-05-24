const express = require("express");
const userController = require("../controllers/userController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/user/email/:email", (req, res) => {
    userController.getUserDetails(query, req, res);
  });

  router.get("/user/attendance", auth0, (_, res) => {
    userController.getUserAttendance(query, res);
  });

  router.post("/user/attendance", auth0, (req, res) => {
    userController.setUserAttendance(query, req, res);
  });

  router.get("/users", auth0, (req, res) => {
    userController.getUsers(query, req, res);
  });

  router.get("/inactiveusers", auth0, (req, res) => {
    userController.getInactiveUsers(query, req, res);
  });

  router.get("/user/:userId", auth0, (req, res) => {
    userController.getUserById(query, req, res);
  });

  router.post("/user/:user/skills", auth0, (req, res) => {
    userController.updateUserSkills(query, req, res);
  });

  router.post("/user/:user/roles", auth0, (req, res) => {
    userController.updateUserRoles(query, req, res);
  });

  router.post("/user", auth0, (req, res) => {
    userController.updateUser(query, req, res);
  });

  router.get("/user/:user/skills", auth0, (req, res) => {
    userController.getUserSkills(query, req, res);
  });

  router.get("/user/:user/roles", auth0, (req, res) => {
    userController.getUserRoles(query, req, res);
  });

  router.post("/user/free", (req, res) => {
    userController.insertFreeUser(query, req, res);
  });

  router.post("/user/hoursnew", auth0, (req, res) => {
    userController.getUserProjectHoursNew(query, req, res);
  });

  router.put("/user/hours", auth0, (req, res) => {
    userController.saveUserProjectHours(query, req, res);
  });

  router.get("/user/username/:username", (req, res) => {
    userController.getUserInfo(query, req, res);
  });

  router.get("/user/:userId/goals", auth0, (req, res) => {
    userController.getUserGoals(query, req, res);
  });

  router.post("/user/password", (req, res) => {
    userController.changePassword(query, req, res);
  });

  router.post("/user/profile", auth0, (req, res) => {
    userController.changeProfile(query, req, res);
  });

  return router;
};

module.exports = wrapper;
