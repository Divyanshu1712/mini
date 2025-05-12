const express = require("express");
const { submitPost } = require("../controllers/postController");
const { isLoggedIn } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/submit-post", isLoggedIn, submitPost);

module.exports = router;
