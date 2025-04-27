const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
    comment: {
      type: String,
      required: [true, "Comment text is required"],
    },
    deleted: {
      type: Boolean,
      default: false, // default value is false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
