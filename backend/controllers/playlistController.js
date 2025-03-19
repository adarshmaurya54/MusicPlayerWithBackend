const Playlist = require("../models/playlistModel");
const mongoose = require("mongoose");
exports.createPlaylist = async (req, res) => {
    const { name,description, userId} = req.body;
    try {
        const newPlaylist = new Playlist({ name, description, user_id: userId });
        await newPlaylist.save();
        res.status(201).json(newPlaylist);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.getUserPlaylist = async (req, res) => {
    try {
        // Convert userId to ObjectId properly
        const userId = new mongoose.Types.ObjectId(req.body.userId);

        // Find playlists based on user_id
        const playlists = await Playlist.find({ user_id: userId }).populate('songs');

        // Return playlists if found
        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error fetching playlists:", error);
        res.status(500).json({ error: "Error fetching playlists" });
    }
};