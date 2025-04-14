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
