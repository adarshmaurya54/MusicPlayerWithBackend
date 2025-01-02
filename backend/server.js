const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Import controllers
const artistController = require('./controllers/artistController');
const songController = require('./controllers/songController');

// MongoDB connection
connectDB();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running and connected to MongoDB!");
});

// Routes for artists
app.post('/artist', artistController.createArtist);  // Create artist
app.get('/artists', artistController.getAllArtists); // Get all artists

// Routes for songs
app.post('/song', songController.createSong);  // Create song
app.get('/songs', songController.getAllSongs); // Get all songs with artist details

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
