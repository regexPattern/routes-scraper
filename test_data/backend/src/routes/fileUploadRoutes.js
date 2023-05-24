const express = require("express");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, req.query.user + "_" + `${file.originalname}`);
  },
});

const storage_html = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, finalConfig.uploads);
  },
  filename: (req, file, callBack) => {
    callBack(null, req.query.user + "_" + `${file.originalname}`);
  },
});

const storage_picture = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, finalConfig.pictures);
  },
  filename: (req, file, callBack) => {
    callBack(null, req.query.user + ".jpg");
  },
});

const upload = multer({ storage: storage });
const upload_html = multer({ storage: storage_html });
const upload_picture = multer({ storage: storage_picture });

var wrapper = ({ query, auth0 }) => {
  const router = express.Router();

  router.post("/file", upload.single("file"), (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error("No File");
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send(file);
  });

  router.post(
    "/user-picture",
    upload_picture.single("file"),
    (req, res, next) => {
      const file = req.file;
      if (!file) {
        const error = new Error("No File");
        error.httpStatusCode = 400;
        return next(error);
      }
      res.send(file);
    }
  );

  router.post(
    "/notification-image",
    upload_html.single("file"),
    (req, res, next) => {
      const file = req.file;
      if (!file) {
        const error = new Error("No File");
        error.httpStatusCode = 400;
        return next(error);
      }
      res.send(file);
    }
  );

  router.post("/multipleFiles", upload.array("files"), (req, res, next) => {
    const files = req.files;
    if (!files) {
      const error = new Error("No File");
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send({ status: "ok" });
  });

  return router;
};

module.exports = wrapper;
