const express = require("express");
const scopeController = require("../controllers/scopeController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/scope/:scopeId", (req, res) => {
    scopeController.getScope(query, req, res);
  });

  router.get("/scopes/active", auth0, (req, res) => {
    scopeController.getActiveScopes(query, req, res);
  });

  router.get("/scopes/completed", auth0, (req, res) => {
    scopeController.getCompletedScopes(query, req, res);
  });

  router.get("/scopes/teams", auth0, (_, res) => {
    scopeController.getTeams(query, res);
  });

  router.get("/scope/:scopeId/teams", auth0, (req, res) => {
    scopeController.getScopeTeams(query, req, res);
  });
  
  router.post("/scope", auth0, (req, res) => {
    scopeController.updateScope(query, req, res);
  });

  router.delete("/scope/expense/:expenseId", auth0, (req, res) => {
    scopeController.removeScopeExpense(query, req, res);
  });

  router.post("/scope/expense", auth0, (req, res) => {
    scopeController.updateScopeExpense(query, req, res);
  });

  router.put("/scope/insertscoperesource", auth0, (req, res) => {
    scopeController.addScopeResource(query, req, res);
  });

  router.post("/scope/updatescoperesource", auth0, (req, res) => {
    scopeController.updateScopeResource(query, req, res);
  });

  router.post("/scope/updatescoperesourcehours", auth0, (req, res) => {
    scopeController.updateScopeResourceHours(query, req, res);
  });

  router.delete(
    "/scope/deletescoperesource/:scopeResourceId",
    auth0,
    (req, res) => {
      scopeController.deleteScopeResource(query, req, res);
    }
  );

  router.delete("/scope/archive/:scopeId", auth0, (req, res) => {
    scopeController.archiveScope(query, req, res);
  });

  router.post("/scope/duplicate", auth0, (req, res) => {
    scopeController.duplicateScope(query, req, res);
  });

  router.delete("/scope/:scopeId", auth0, (req, res) => {
    scopeController.deleteScope(query, req, res);
  });

  router.post("/scope/activate/:scopeId", auth0, (req, res) => {
    scopeController.activateScope(query, req, res);
  });

  router.post("/scope/:scopeId/contract/:contractId", auth0, (req, res) => {
    scopeController.migrateScope(query, req, res);
  });

  router.get("/resources/latestrateversion", auth0, (_, res) => {
    scopeController.getLatestRateVersion(query, res);
  });

  return router;
};

module.exports = wrapper;
