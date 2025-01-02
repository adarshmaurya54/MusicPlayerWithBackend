const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  artistName: {
    type: String,
    required: [true, 'Artist name is required'],
  },
  img: {
    type: String,
    required: [true, 'Artist image is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
