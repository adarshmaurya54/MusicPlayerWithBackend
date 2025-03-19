const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Refers to userModel
        required: true
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"  // Refers to songModel
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    }
});

playlistSchema.path("songs").default([]);

module.exports = mongoose.model("Playlist", playlistSchema);