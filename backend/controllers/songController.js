const Song = require('../models/songModel');

// Create a song
exports.createSong = async (req, res) => {
  const { songId, songName, artistId, poster } = req.body;

  try {
    const newSong = new Song({ songId, songName, artist: artistId, poster });
    await newSong.save();
    res.status(201).json({ message: 'Song created', song: newSong });
  } catch (error) {
    res.status(500).json({ message: 'Error creating song', error: error.message });
  }
};

// Get all songs with artist details
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate('artist');
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching songs', error: error.message });
  }
};
