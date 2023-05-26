const express = require("express");
const departmentController = require("../controllers/departmentController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/departments", auth0, (req, res) => {
    departmentController.getDepartments(query, req, res);
  });

  router.get("/department/:department/users", auth0, (req, res) => {
    departmentController.getDepartmentUsers(query, req, res);
  });

  router.get(
    "/department/:department/projectionsnew/:year/:month",
    auth0,
    (req, res) => {
      departmentController.getDepartmentProjectionsNew(query, req, res);
    }
  );

  router.get(
    "/departmentclient/:department/projectionsnew/:year/:month",
    auth0,
    (req, res) => {
      departmentController.getDepartmentClientProjectionsNew(query, req, res);
    }
  );

  router.get(
    "/departmentsummary/projectionsnew/:year/:month",
    auth0,
    (req, res) => {
      departmentController.getDepartmentSummaryProjectionsNew(query, req, res);
    }
  );

  router.get("/department/:department/actualsnew", auth0, (req, res) => {
    departmentController.getDepartmentUserSummaryActualsNew(query, req, res);
  });

  router.get("/department/:department/projectionmix", auth0, (req, res) => {
    departmentController.getDepartmentProjectionMix(query, req, res);
  });

  router.get("/resource/:userId/projectionmix", auth0, (req, res) => {
    departmentController.getResourceProjectionMix(query, req, res);
  });

  router.get("/department/:department/resources", auth0, (req, res) => {
    departmentController.getDepartmentResources(query, req, res);
  });

  router.get("/teamcapacity", (req, res) => {
    departmentController.getTeamCapacity(query, req, res);
  });

  router.get("/resourcecapacity", (req, res) => {
    departmentController.getResourceCapacity(query, req, res);
  });

  router.post("/department/:department/users", auth0, (req, res) => {
    departmentController.updateDepartmentResources(query, req, res);
  });

  router.post("/department", auth0, (req, res) => {
    departmentController.updateDepartment(query, req, res);
  });

  return router;
};

module.exports = wrapper;
