const express = require("express");
const notificationController = require("../controllers/notificationController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.get("/user/:userId/notifications", (req, res) => {
    notificationController.getUserNotifications(query, req, res);
  });

  router.get("/notification/:notificationId", (req, res) => {
    notificationController.getNotification(query, req, res);
  });

  router.get("/notifications/active", auth0, (req, res) => {
    notificationController.getActiveNotifications(query, req, res);
  });

  router.get("/notifications/inactive", auth0, (req, res) => {
    notificationController.getInactiveNotifications(query, req, res);
  });

  router.get("/user/:userId/notifications/saved", (req, res) => {
    notificationController.getSavedNotifications(query, req, res);
  });

  router.post("/notification", auth0, (req, res) => {
    notificationController.updateNotification(query, req, res);
  });

  router.post("/usernotification", auth0, (req, res) => {
    notificationController.updateUserNotification(query, req, res);
  });

  router.post("/usernotification-bookmark", auth0, (req, res) => {
    notificationController.updateUserBookmark(query, req, res);
  });

  router.delete("/notification/:notificationId", auth0, (req, res) => {
    notificationController.deleteNotification(query, req, res);
  });

  return router;
};

module.exports = wrapper;
