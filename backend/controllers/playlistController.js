const Playlist = require("../models/playlistModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
exports.createPlaylist = async (req, res) => {
  const { name, description, userId } = req.body;
  try {
    const newPlaylist = new Playlist({ name, description, user_id: userId });
    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getUserPlaylists = async (req, res) => {
  try {
    // Convert userId to ObjectId properly
    const userId = new mongoose.Types.ObjectId(req.body.userId);

    // Find playlists based on user_id
    const playlists = await Playlist.find({ user_id: userId }).populate(
      "songs"
    );

    // Return playlists if found
    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Error fetching playlists" });
  }
};
exports.getUserPlaylistByPlaylistId = async (req, res) => {
  try {
    const playlistId = new mongoose.Types.ObjectId(req.params.playlistId);
    const playlist = await Playlist.findOne({ _id: playlistId })
      .populate("songs")
      .populate({
        path: "user_id",
        select: "profilePic name", // Only include these two fields
      });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Return playlist if found
    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ error: "Error fetching playlist" });
  }
};

exports.getUserPublicPlaylistByPlaylistId = async (req, res) => {
  try {
    const playlistId = new mongoose.Types.ObjectId(req.params.playlistId);

    // Find one playlist by ID
    const playlist = await Playlist.findOne({ _id: playlistId })
      .populate("songs")
      .populate({
        path: "user_id",
        select: "profilePic name", // Only include these two fields
      });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Check if the playlist is public
    if (!playlist.public) {
      return res.status(403).json({ error: "Access denied. Playlist is not public." });
    }

    // Return playlist if it's public
    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ error: "Error fetching playlist" });
  }
};


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

exports.editPlaylist = async (req, res) => {
  try {
    const { id, playlistName, playlistDescription } = req.body;
    const playlistObjectId = new mongoose.Types.ObjectId(id);
    // Find and update playlist by ID
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistObjectId,
      {
        name: playlistName,
        description: playlistDescription,
      },
      { new: true, runValidators: true }
    ).populate("songs");

    // Check if playlist exists
    if (!updatedPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({
      message: "Playlist updated successfully!",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).json({ error: "Error updating playlist" });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    // Find playlist by ID
    const playlist = await Playlist.findById(id);

    // Check if playlist exists
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    // Delete the playlist
    await Playlist.findByIdAndDelete(id);

    res.status(200).json({ message: "Playlist deleted successfully!" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ error: "Error deleting playlist" });
  }
};
exports.deletePlaylistSong = async (req, res) => {
  const { playlistId } = req.params;
  const { songId } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Convert songId to ObjectId
    const objectId = new ObjectId(songId);

    // Filter out the song by comparing ObjectId
    playlist.songs = playlist.songs.filter((song) => !song.equals(objectId));

    // Save the updated playlist
    const updatedPlaylist = await playlist.save();
    res.status(200).json({
      message: "Song deleted successfully",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({ message: "Error deleting song" });
  }
};

exports.updatePlaylistVisibility = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { visibility } = req.body; // true or false

    if (typeof visibility !== "boolean") {
      return res.status(400).json({ message: "Visibility must be a boolean value." });
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { public: visibility },
      { new: true }
    );

    if (!updatedPlaylist) {
      return res.status(404).json({ message: "Playlist not found." });
    }

    res.status(200).json({
      message: `Playlist visibility updated to ${visibility ? "public" : "private"}.`,
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error("Error updating playlist visibility:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

