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

exports.getUserPlaylists = async (req, res) => {
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
exports.getUserPlaylistByPlaylistId = async (req, res) => {
    try {
        // Convert playlistid to ObjectId properly
        const playlistId = new mongoose.Types.ObjectId(req.params.playlistId);

        // Find playlist based on playlistid
        const playlists = await Playlist.find({ _id: playlistId }).populate('songs');

        // Return playlists if found
        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error fetching playlist:", error);
        res.status(500).json({ error: "Error fetching playlist" });
    }
}

// Add songs to playlist
exports.addSongs = async (req, res) => {
    try {
        const { playlistId, songs } = req.body;

        // Convert playlistId and song IDs to ObjectId
        const playlistObjectId = new mongoose.Types.ObjectId(playlistId);
        const songObjectIds = songs.map((id) => new mongoose.Types.ObjectId(id));

        // Find the playlist by ID
        const playlist = await Playlist.findById(playlistObjectId);

        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        // Push new song IDs if they don't already exist in the playlist
        songObjectIds.forEach((songId) => {
            if (!playlist.songs.some((existingId) => existingId.equals(songId))) {
                playlist.songs.push(songId);
            }
        });

        // Save the updated playlist
        await playlist.save();

        res.status(200).json({ message: "Songs added successfully", playlist });
    } catch (error) {
        console.error("Error adding songs to playlist:", error);
        res.status(500).json({ error: "Error adding songs to playlist" });
    }
};