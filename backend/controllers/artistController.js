const Artist = require('../models/artistModel');

// Create an artist
exports.createArtist = async (req, res) => {
  const { artistName, img } = req.body;

  try {
    const newArtist = new Artist({ artistName, img });
    await newArtist.save();
    res.status(201).json({ message: 'Artist created', artist: newArtist });
  } catch (error) {
    res.status(500).json({ message: 'Error creating artist', error: error.message });
  }
};

// Get all artists
exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists', error: error.message });
  }
};
