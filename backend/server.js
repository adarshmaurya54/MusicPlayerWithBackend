const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
// Serve files from the 'public/assets/audio' folder
app.use('/assets/audio', express.static(path.join(__dirname, 'assets', 'audio')));
app.use('/assets/thumbnails', express.static(path.join(__dirname, 'assets', 'thumbnails')));

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'assets', 'audio');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create the folder if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const songId = req.body.songId.replace(/\s+/g, ''); // Remove spaces for songId
    cb(null, `${songId}.mp3`); // Save the audio file with songId.mp3
  }
});

// Multer upload middleware
const upload = multer({ storage });

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running and connected to MongoDB!");
});

// Public Routes (no authentication required)
app.post('/login', authController.login);  // Login route
app.get('/songs', songController.getAllSongs); // Get all songs with artist details
app.get('/artists', artistController.getAllArtists); // Get all artists
app.get('/song/:filename', songController.getSongWithMetadata); // Get song by filename with metadata

// Protected Routes (authentication required for posting)
app.use(verifyToken); // Apply token verification middleware globally for all routes below

// Song Routes
app.post('/song', upload.single('audioFile'), songController.createSong); // Create song with file upload

// Artist Routes
app.post('/artist', artistController.createArtist); // Create artist

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log error stack for debugging
  res.status(500).send({ error: "Something went wrong!" });  // Send error response
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
