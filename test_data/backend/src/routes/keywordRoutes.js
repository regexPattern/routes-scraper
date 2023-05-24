const express = require("express");
const keywordController = require("../controllers/keywordController");

var wrapper = ({ query }) => {
  const router = express.Router();

  router.get("/keyword/tags", (_, res) => {
    keywordController.getTags(query, res);
  });

  router.post("/keywordController", (req, res) => {
    keywordController.getKeywords(query, req, res);
  });

  router.post("/keywordcount", (req, res) => {
    keywordController.getKeywordCount(query, req, res);
  });

  router.get("/keywordlist", (req, res) => {
    keywordController.getKeywordList(query, req, res);
  });

  router.get("/keyword/:keywordId", (req, res) => {
    keywordController.getKeywordById(query, req, res);
  });

  router.post("/keywordphrase", (req, res) => {
    keywordController.getKeywordByPhrase(query, req, res);
  });

  router.get("/keywordmetrics/:phrase/:locale", (req, res) => {
    keywordController.getKeywordMetricsByPhrase(query, req, res);
  });

  // router.get('/platform/metrics',  (req, res) => {
  //   projects.getPlatformMetrics(query, res)
  //
  // });

  // --------------------
  // Locales
  // --------------------
  router.get("/locales", (_, res) => {
    keywordController.getLocales(query, res);
  });

  router.patch("/keyword/:keywordId/approval", (req, res) => {
    keywordController.approveKeyword(query, req, res);
  });

  router.patch("/keyword", (req, res) => {
    keywordController.updateKeyword(query, req, res);
  });

  router.post("/keyword/tag", (req, res) => {
    keywordController.addTag(query, req, res);
  });

  router.post("/keyword/geo", (req, res) => {
    keywordController.addGeo(query, req, res);
  });

  router.post("/submission", (req, res) => {
    keywordController.newSubmission(query, req, res);
  });

  router.put("/submission", (req, res) => {
    keywordController.updateSubmission(query, req, res);
  });

  router.post("/importkeywords", (req, res) => {
    keywordController.importKeywords(query, req, res);
  });

  router.post("/updatekeywordcount", (_, res) => {
    keywordController.updateKeywordCounts(query, res);
  });

  router.post("/updatekeywordsyntax/:count", (req, res) => {
    keywordController.updateKeywordSyntax(query, req, res);
  });

  router.get("/collections/private", (req, res) => {
    keywordController.getMyCollections(query, req, res);
  });

  router.get("/collections/public", (req, res) => {
    keywordController.getPublicCollections(query, req, res);
  });

  router.get(
    "/collection/:collectionId/keywordController/:pageSize/:pageNumber",
    (req, res) => {
      keywordController.getCollectionKeywords(query, req, res);
    }
  );

  router.get("/collection/:collectionId/keywordscount", (req, res) => {
    keywordController.getCollectionKeywordsCount(query, req, res);
  });

  router.post("/updatecollection", (req, res) => {
    keywordController.updateCollection(query, req, res);
  });

  router.post("/updatecollectionkeyword", (req, res) => {
    keywordController.updateCollectionKeyword(query, req, res);
  });

  router.delete("/deletecollection/:collectionId", (req, res) => {
    keywordController.deleteCollection(query, req, res);
  });

  router.delete("/deletecollectionkeyword/:collectionKeywordId", (req, res) => {
    keywordController.deleteCollectionKeyword(query, req, res);
  });

  router.delete("/deleteallcollectionkeywords/:collectionId", (req, res) => {
    keywordController.deleteAllCollectionKeywords(query, req, res);
  });

  return router;
};

module.exports = wrapper;
