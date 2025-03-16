const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    songId: {
      type: String,
      required: [true, "Song ID is required"],
      set: (value) => value.replace(/\s+/g, ""), // Remove spaces from song name for songId
    },
    songName: {
      type: String,
      required: [true, "Song name is required"],
    },
    artistName: {
      type: String,
      required: [true, "Artist name is required"],
    },
    lyrics: {
      type: String,
      required: [true, "Song lyrics are required"],
    },
    favourite: {
      type: Boolean,
      default: false, // Set default value to false
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    audioFile: {
      type: String, // The file path to store the audio
      required: [true, "Audio file is required"],
      set: (value) => `${value}`, // Ensure the audio file is saved with the .mp3 format
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);
