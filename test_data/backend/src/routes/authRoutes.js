const express = require("express");

const authController = require("../controllers/authController");

var wrapper = ({ query }) => {
  const router = express.Router();

  router.post("/auth/token", (req, res) => {
    authController.getToken(query, req, res);
  });

  router.get("/api/passwordreset/:emailAddress", (req, res) => {
    authController.passwordReset(req, res);
  });

  router.get("/api/passwordresetcheck/:cryptoText", (req, res) => {
    authController.passwordResetCheck(req, res);
  });

  return router;
};

module.exports = wrapper;
