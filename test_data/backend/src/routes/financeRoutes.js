const express = require("express");
const financeController = require("../controllers/financeController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/lastpostdate", auth0, (_, res) => {
    financeController.getLastPostDate(query, res);
  });

  router.get("/monthlyrevenue/:year", (req, res) => {
    financeController.getMonthlyRevenue(query, req, res);
  });

  router.get("/home/chart", (_, res) => {
    financeController.getHomeFinanceChart(query, res);
  });

  router.get("/monthlyheadcount/:year", auth0, (req, res) => {
    financeController.getMonthlyHeadcount(query, req, res);
  });

  router.get("/revenueperhead/:year", auth0, (req, res) => {
    financeController.getRevenuePerHead(query, req, res);
  });

  router.get("/ytdrevenue/:year", auth0, (req, res) => {
    financeController.getYtdRevenue(query, req, res);
  });

  router.get("/usercounts/:year/:month", auth0, (req, res) => {
    financeController.getUserCounts(query, req, res);
  });

  router.get("/monthlyebitda/:year", auth0, (req, res) => {
    financeController.getMonthlyEBITDA(query, req, res);
  });

  router.get("/ytdebitda/:year", auth0, (req, res) => {
    financeController.getYtdEBITDA(query, req, res);
  });

  router.get("/monthlymargin/:year", (req, res) => {
    financeController.getMonthlyMargin(query, req, res);
  });

  router.get("/ytdmargin/:year", (req, res) => {
    financeController.getYtdMargin(query, req, res);
  });

  router.get("/marginpctrevenue/:year", (req, res) => {
    financeController.getMarginPctRevenue(query, req, res);
  });

  router.get("/ebitdapctrevenue/:year", auth0, (req, res) => {
    financeController.getEbitdaPctRevenue(query, req, res);
  });

  router.get("/revenuetoplan/:year/:month", auth0, (req, res) => {
    financeController.getRevenueToPlan(query, req, res);
  });

  router.get("/margintoplan/:year/:month", auth0, (req, res) => {
    financeController.getMarginToPlan(query, req, res);
  });

  router.get("/ebitdatoplan/:year/:month", auth0, (req, res) => {
    financeController.getEbitdaToPlan(query, req, res);
  });

  router.get("/revheadtoplan/:year/:month", auth0, (req, res) => {
    financeController.getRevHeadToPlan(query, req, res);
  });

  router.get("/departmentheadcount/:year/:month", (req, res) => {
    financeController.getDepartmentHeadcount(query, req, res);
  });

  router.get(
    "/departmentheadcountmonthly/:year/:month",
    (req, res) => {
      financeController.getDepartmentHeadcountMonthly(query, req, res);
    }
  );

  router.get("/sourcedata/:name/:year", auth0, (req, res) => {
    financeController.getSourceData(query, req, res);
  });

  router.get("/summary/:year", auth0, (req, res) => {
    financeController.getSummary(query, req, res);
  });

  router.post("/sourcedata/:name/:year", auth0, (req, res) => {
    financeController.updateSourceData(query, req, res);
  });

  router.post("/importrevenues", auth0, (req, res) => {
    financeController.importClientRevenue(query, req, res);
  });

  router.get("/scoped", auth0, (_, res) => {
    financeController.getScopedRevenue(query, res);
  });
  router.get("/scopes", auth0, (_, res) => {
    financeController.getApprovedScopes(query, res);
  });

  router.get("/activecontracts/:year", auth0, (req, res) => {
    financeController.getActiveContracts(query, req, res);
  });

  router.get("/monthlyaop/:year", auth0, (req, res) => {
    financeController.getMonthlyAOP(query, req, res);
  });

  router.post("/selectedscope", auth0, (req, res) => {
    financeController.updateSelectedScope(query, req, res);
  });

  router.post("/updateactivecontract", auth0, (req, res) => {
    financeController.updateActiveContract(query, req, res);
  });

  return router;
};

module.exports = wrapper;
