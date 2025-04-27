const { default: mongoose } = require("mongoose");
const Comment = require("../models/commentModel");
const Song = require("../models/songModel");

exports.postComment = async (req, res) => {
  try {
    const { songId, comment } = req.body;
    const userId = req.body.userId;

    if (!songId || !comment) {
      return res
        .status(400)
        .json({ message: "Song ID and comment are required" });
    }

    const songExists = await Song.findById(songId);
    if (!songExists) {
      return res.status(404).json({ message: "Song not found" });
    }

    const newComment = await Comment.create({
      userId,
      songId,
      comment,
    });

    res.status(201).json({
      message: "Comment posted successfully",
      data: newComment,
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllCommentForSong = async (req, res) => {
  try {
    const { songId } = req.params;
    if (!songId)
      return res.status(400).json({ message: "Song ID is required" });

    const _songId = new mongoose.Types.ObjectId(songId);

    const comments = await Comment.find({ songId: _songId })
      .populate("userId") 
      .populate("songId") 
      .sort({ createdAt: 1 }); 

    res.status(200).json({
      message: "Comments",
      data: comments,
    });
  } catch (error) {
    console.error("Error getting comments: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = new mongoose.Types.ObjectId(req.params.commentId);

    // First, find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found!" });
    }

    // Check if comment is within 1 day (24 hours)
    const createdTime = new Date(comment.createdAt).getTime();
    const currentTime = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000; // milliseconds in one day

    if (currentTime - createdTime > oneDayInMs) {
      return res.status(400).json({ message: "Cannot delete comment after 1 day." });
    }

    // If within 1 day, then update (soft delete)
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { comment: "", deleted: true },
      { new: true }
    )
    .populate("userId")
    .populate("songId");

    res.status(200).json({ message: "Comment updated successfully", updatedComment });

  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};

