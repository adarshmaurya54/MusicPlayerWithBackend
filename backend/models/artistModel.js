const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }, // Ensure unique artist names
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Artist", artistSchema);
