const express = require("express");

const ngramController = require("../controllers/ngramController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.post("/import", (req, res) => {
    ngramController.importNgramKeywords(query, req, res);
  });

  router.post("/analysis/importcount", (req, res) => {
    ngramController.updateImportCount(query, req, res);
  });

  router.post("/analysis/save", (req, res) => {
    ngramController.saveNgramAnalysis(query, req, res);
  });

  router.post("/analysis", (req, res) => {
    ngramController.getAllAnalysis(query, req, res);
  });

  router.post("/archived", (req, res) => {
    ngramController.getArchivedAnalysis(query, req, res);
  });

  router.post("/analysis/:analysisId/loadngrams/", (req, res) => {
    ngramController.loadNgrams(query, req, res);
  });

  router.post("/analysis/:analysisId/ngrams/", (req, res) => {
    ngramController.getAnalysisNgrams(query, req, res);
  });

  router.get("/analysis/name/:name", (req, res) => {
    ngramController.getNgramAnalysis(query, req, res);
  });

  router.get("/analysis/:analysisId/imported", (req, res) => {
    ngramController.getImportedRecords(query, req, res);
  });

  router.get("/analysis/:analysisId/pctcomplete", (req, res) => {
    ngramController.getPctComplete(query, req, res);
  });

  router.delete("/analysis/:analysisId/clearimport", (req, res) => {
    ngramController.clearImport(query, req, res);
  });

  router.get("/analysis/:analysisId/selectedkeywords", (req, res) => {
    ngramController.getSelectedKeywords(query, req, res);
  });

  router.post("/analysis/:analysisId/keywords", (req, res) => {
    ngramController.getNgramKeywords(query, req, res);
  });

  router.post("/analysis/exportkeywords", (req, res) => {
    ngramController.getKeywordExport(query, req, res);
  });

  router.post("/urls", (req, res) => {
    ngramController.getKeywordUrls(query, req, res);
  });

  router.post("/selections", (req, res) => {
    ngramController.saveNgramSelection(query, req, res);
  });
  router.post("/keyword/selections", (req, res) => {
    ngramController.saveKeywordSelection(query, req, res);
  });

  router.delete("/archive/:analysisId", (req, res) => {
    ngramController.archiveAnalysis(query, req, res);
  });

  router.delete("/delete/:analysisId", (req, res) => {
    ngramController.deleteAnalysis(query, req, res);
  });

  return router;
};

module.exports = wrapper;
