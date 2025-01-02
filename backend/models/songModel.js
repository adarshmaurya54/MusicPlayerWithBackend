const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  songId: {
    type: String,
    required: [true, 'Song ID is required'],
  },
  songName: {
    type: String,
    required: [true, 'Song name is required'],
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist', // Reference to the Artist collection
    required: [true, 'Artist is required'],
  },
  poster: {
    type: String,
    required: [true, 'Song poster is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
