const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Import controllers
const artistController = require('./controllers/artistController');
const songController = require('./controllers/songController');
const authController = require("./controllers/authController");

// Import middleware
const verifyToken = require("./middelware/verifyToken");

// MongoDB connection
connectDB();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Cross-origin resource sharing (for allowing frontend to communicate)
app.use(express.json()); // Parses incoming JSON requests and puts the parsed data in `req.body`

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running and connected to MongoDB!");
});

// Public Routes (no authentication required)
app.post('/login', authController.login);  // Login route
app.get('/songs', songController.getAllSongs); // Get all songs with artist details
app.get('/artists', artistController.getAllArtists); // Get all artists

// Protected Routes (authentication required for posting)
app.use(verifyToken); // Apply token verification middleware globally for all routes below

app.post('/song', songController.createSong);  // Create song
app.post('/artist', artistController.createArtist);  // Create artist

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log error stack for debugging
  res.status(500).send({ error: "Something went wrong!" });  // Send error response
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
