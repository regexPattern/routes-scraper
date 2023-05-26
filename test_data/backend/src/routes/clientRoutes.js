const express = require("express");
const clientController = require("../controllers/clientController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/allclients", auth0, (req, res) => {
    clientController.getAllClients(query, req, res);
  });

  router.get("/apiclients", auth0, (req, res) => {
    clientController.getApiClients(query, req, res);
  });

  router.get("/clients", auth0, (req, res) => {
    clientController.getClients(query, req, res);
  });

  router.get("/activeclients", auth0, (req, res) => {
    clientController.getActiveClients(query, req, res);
  });

  router.get("/customer/:customerId/clients", auth0, (req, res) => {
    clientController.getCustomerClients(query, req, res);
  });

  router.get("/client/contracts", auth0, (req, res) => {
    clientController.getClientContracts(query, req, res);
  });

  router.post("/client/:acronym/apisummary", (req, res) => {
    clientController.getClientAPISummary(query, req, res);
  });

  router.post("/client/:acronym/apiresults", (req, res) => {
    clientController.getClientAPIResults(query, req, res);
  });

  router.get("/user/contracts", auth0, (req, res) => {
    clientController.getUserClientContracts(query, req, res);
  });

  router.get(
    "/client/reporting/:client/:ga/:period/:enddate/:compare",
    (req, res) => {
      clientController.getClientReporting(query, req, res);
    }
  );

  router.get("/client/trendedviews/:client/:ga/:enddate", (req, res) => {
    clientController.getClientTrendedViews(query, req, res);
  });

  router.get("/contracts", auth0, (_, res) => {
    clientController.getAllContracts(query, res);
  });

  router.get("/client/:client/config", auth0, (req, res) => {
    clientController.getClientConfig(query, req, res);
  });

  router.get("/services", auth0, (_, res) => {
    clientController.getServices(query, res);
  });

  router.get("/industries", auth0, (_, res) => {
    clientController.getIndustries(query, res);
  });

  router.get("/tag_industries", auth0, (_, res) => {
    clientController.getTagIndustries(query, res);
  });

  router.get("/tag_industry/:industryId/lobs", auth0, (req, res) => {
    clientController.getTagIndustryLOBs(query, req, res);
  });

  router.get("/client/:clientId/contracts", auth0, (req, res) => {
    clientController.getClientContracts(query, req, res).catch(console.error);
  });

  router.get("/client/:clientId/activecontracts", auth0, (req, res) => {
    clientController.getClientActiveContracts(query, req, res);
  });

  router.get("/client/:clientId/inactivecontracts", auth0, (req, res) => {
    clientController.getClientInactiveContracts(query, req, res);
  });

  router.post("/client", auth0, (req, res) => {
    clientController.updateClient(query, req, res);
  });

  router.post("/client/:clientId/services", auth0, (req, res) => {
    clientController.updateClientServices(query, req, res);
  });

  router.post("/client/:clientId/industries", auth0, (req, res) => {
    clientController.updateClientIndustries(query, req, res);
  });

  router.put("/clientbrand", auth0, (req, res) => {
    clientController.insertClientBrand(query, req, res);
  });

  router.post("/clientbrand", auth0, (req, res) => {
    clientController.updateClientBrand(query, req, res);
  });

  router.delete("/clientbrand/:brandId", auth0, (req, res) => {
    clientController.deleteClientBrand(query, req, res);
  });

  router.put("/filter", auth0, (req, res) => {
    clientController.insertFilter(query, req, res);
  });

  router.delete("/filter/:filterId", auth0, (req, res) => {
    clientController.deleteFilter(query, req, res);
  });

  router.post("/filter", auth0, (req, res) => {
    clientController.updateFilter(query, req, res);
  });

  router.put("/filterentry", auth0, (req, res) => {
    clientController.insertFilterEntry(query, req, res);
  });

  router.post("/filterentry", auth0, (req, res) => {
    clientController.updateFilterEntry(query, req, res);
  });

  router.delete("/filterentry/:filterEntryId", auth0, (req, res) => {
    clientController.deleteFilterEntry(query, req, res);
  });

  router.put("/filterentrycriteria", auth0, (req, res) => {
    clientController.insertFilterEntryCriteria(query, req, res);
  });

  router.post("/filterentrycriteria", auth0, (req, res) => {
    clientController.updateFilterEntryCriteria(query, req, res);
  });

  router.delete(
    "/filterentrycriteria/:filterEntryCriteriaId",
    auth0,
    (req, res) => {
      clientController.deleteFilterEntryCriteria(query, req, res);
    }
  );

  router.post("/contract", auth0, (req, res) => {
    clientController.updateContract(query, req, res);
  });

  router.post("/contract/approval", auth0, (req, res) => {
    clientController.updateContractApproval(query, req, res);
  });

  router.delete("/client/:clientId/deactivate", auth0, (req, res) => {
    clientController.deactivateClient(query, req, res);
  });

  router.post("/client/:clientId/activate", auth0, (req, res) => {
    clientController.activateClient(query, req, res);
  });

  router.delete("/contract/:contractId/deactivate", auth0, (req, res) => {
    clientController.deactivateContract(query, req, res);
  });

  router.post("/contract/:contractId/activate", auth0, (req, res) => {
    clientController.activateContract(query, req, res);
  });

  router.post("/contract/:contractId/stakeholders", auth0, (req, res) => {
    clientController.updateContractStakeholders(query, req, res);
  });

  router.get("/client/:clientId", (req, res) => {
    clientController.getClientById(query, req, res);
  });

  return router;
};

module.exports = wrapper;
