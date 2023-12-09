const express = require("express");
const route = express.Router();
const multer = require("multer");
const path = require("path");

const feedbackController = require("../app/controllers/FeedbackController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/image/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

route.post(
  "/storeFeedback",
  upload.single("image"),
  feedbackController.storeFeedback
);

module.exports = route;
