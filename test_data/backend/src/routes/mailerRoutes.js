const express = require("express");
const mailerController = require("../controllers/mailerController");

var wrapper = ({ query }) => {
  const router = express.Router();

  router.post("/sendmail", (req, res) => {
    mailerController.sendMail({ req, res });
  });

  router.get("/emailtemplates", (_, res) => {
    mailerController.getEmailTemplates(query, res);
  });

  router.get("/emailtemplate/:template", (req, res) => {
    mailerController.getEmailTemplate({ query, req, res });
  });

  return router;
};

module.exports = wrapper;
