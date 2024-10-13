const express = require("express");
const router = express.Router();

const {
  createPost,
  addComment,
  getFeed,
  likePost,
} = require("../controllers/PostController");
const { auth } = require("../middlewares/auth");

router.post("/createPost", auth, createPost);
router.post("/:postId/comments", auth, addComment);
router.post("/:postId/likes", auth, likePost);
router.get("/feed", auth, getFeed);

module.exports = router;
