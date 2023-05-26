const express = require("express");
const contentController = require("../controllers/contentController");

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.post("/grammarly/plagiarism", (req, res) => {
    contentController.getGrammarly(query, req, res);
  });

  router.post("/grammarly/analysis", (req, res) => {
    contentController.getGrammarlyAnalysis(query, req, res);
  });

  router.post("/assignments", auth0, (req, res) => {
    contentController.updateContentAssignments(query, req, res);
  });

  router.post("/stagestatus", auth0, (req, res) => {
    contentController.updateContentStatus(query, req, res);
  });

  router.post("/text", auth0, (req, res) => {
    contentController.updateContentText(query, req, res);
  });

  router.post("/data", auth0, (req, res) => {
    contentController.updateContentData(query, req, res);
  });

  router.post("/image", auth0, (req, res) => {
    contentController.updateContentImage(query, req, res);
  });

  router.get("/assignees", (_, res) => {
    contentController.getContentAssignees(query, res);
  });

  router.get("/grade/:contentId", auth0, (req, res) => {
    contentController.getContentGrade(query, req, res);
  });

  // router.get('/:contentId/versions', auth0, (req, res) => {
  //   const contentId = req.params.contentId;
  //   contentController.getContentVersions(query, res, contentId)
  //
  // });

  // router.get('/:contentId/version/:version', auth0, (req, res) => {
  //   const contentId = req.params.contentId;
  //   const version = req.params.version;
  //   contentController.getContentVersion(query, res, contentId, version)
  //
  // });

  router.get("/images/:project", auth0, (req, res) => {
    contentController.getContentImages(query, req, res);
  });

  // router.get('/imagesbylink/:project', auth0, (req, res) => {
  //   const project = req.params.project;
  //   const link = req.query.link;
  //   contentController.getContentImagesByLink(query, res, project, link)
  //
  // });

  router.get("/assignee/:assignee/tasks", auth0, (req, res) => {
    contentController.getAssigneeTasks(query, req, res);
  });

  router.get("/active", auth0, (req, res) => {
    contentController.getActiveBriefs(query, req, res);
  });

  router.get("/activecontent", (req, res) => {
    contentController.getActiveContent(query, req, res);
  });

  router.post("/contract/:contractId", auth0, (req, res) => {
    contentController.getContentByTitle(query, req, res);
  });

  router.get(
    "/complete/client/:client/month/:month/year/:year",
    auth0,
    (req, res) => {
      contentController.getCompleteBriefs(query, req, res);
    }
  );

  router.get(
    "/completecontent/client/:client/month/:month/year/:year",
    auth0,
    (req, res) => {
      contentController.getCompleteContent(query, req, res);
    }
  );

  router.get("/:contentId", auth0, (req, res) => {
    contentController.getContentById(query, req, res);
  });

  router.post("/content", auth0, (req, res) => {
    contentController.updateContent(query, req, res);
  });

  router.delete("/:contentId", auth0, (req, res) => {
    contentController.deleteContent(query, req, res);
  });

  router.put("/keyword", auth0, (req, res) => {
    contentController.insertKeyword(query, req, res);
  });

  router.post("/keyword", auth0, (req, res) => {
    contentController.updateKeyword(query, req, res);
  });

  router.post("/keywordselected", auth0, (req, res) => {
    contentController.updateKeywordSelected(query, req, res);
  });

  router.delete("/keyword/:keywordId", auth0, (req, res) => {
    contentController.deleteKeyword(query, req, res);
  });

  router.put("/question", auth0, (req, res) => {
    contentController.insertQuestion(query, req, res);
  });

  router.post("/question", auth0, (req, res) => {
    contentController.updateQuestion(query, req, res);
  });

  router.delete("/question/:questionId", auth0, (req, res) => {
    contentController.deleteQuestion(query, req, res);
  });

  router.put("/attributes", auth0, (req, res) => {
    contentController.insertAttributes(query, req, res);
  });

  router.post("/attributes", auth0, (req, res) => {
    contentController.updateAttributes(query, req, res);
  });

  router.delete("/attributes/:attributeId", auth0, (req, res) => {
    contentController.deleteAttributes(query, req, res);
  });

  router.put("/link", auth0, (req, res) => {
    contentController.insertLink(query, req, res);
  });

  router.post("/link", auth0, (req, res) => {
    contentController.updateLink(query, req, res);
  });

  router.delete("/link/:linkId", auth0, (req, res) => {
    contentController.deleteLink(query, req, res);
  });

  router.post("/archive/:contentId", auth0, (req, res) => {
    contentController.archiveContent(query, req, res);
  });

  return router;
};

module.exports = wrapper;
