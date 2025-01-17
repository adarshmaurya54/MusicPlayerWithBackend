const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const multer = require("multer");
const path = require("path");

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
app.use('/assets/thumbnails', express.static(path.join(__dirname, 'assets', 'thumbnails')));



// Set up Multer for in-memory file upload (no local storage)
const storage = multer.memoryStorage();  // Store file in memory, not on disk
const upload = multer({ storage });  // Use multer middleware to handle file upload

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running and connected to MongoDB!");
});

// Public Routes (no authentication required)
app.post('/login', authController.login);  // Login route
app.get('/songs', songController.getAllSongs); // Get all songs with artist details
app.get('/artists', artistController.getAllArtists); // Get all artists
app.get('/song/:fileId', songController.getSongWithMetadata); // Get song by filename with metadata
app.delete('/thumbnail/:songId', songController.deleteThumbnails); // Delete thumbnails by songId
app.patch('/favourite/:songId', songController.toggleFavourite);
app.get('/stream/:fileId', songController.streamAudio);

// Token Validation Route (no authentication required)
app.post('/validate-token', authController.validateToken); // Token validation route

// Protected Routes (authentication required for posting)
app.use(verifyToken); // Apply token verification middleware globally for all routes below

// Song Routes
app.post('/song', upload.single('audioFile'), songController.createSong); // Create song with file upload
app.get('/songById/:songId', songController.getSongById); // Get all songs with artist details
app.put('/song/:songId', songController.updateSongById);
app.delete('/song/:songId', songController.deleteSongById);

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
 