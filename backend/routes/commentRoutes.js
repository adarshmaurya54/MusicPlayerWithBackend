const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const verifyToken = require("../middleware/verifyToken");

// POST a comment
router.post("/", verifyToken, commentController.postComment);
router.get("/:songId", commentController.getAllCommentForSong);
router.delete("/:commentId",verifyToken, commentController.deleteComment);

module.exports = router;