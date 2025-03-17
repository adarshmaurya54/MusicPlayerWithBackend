const Playlist = require("../models/playlistModel");

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