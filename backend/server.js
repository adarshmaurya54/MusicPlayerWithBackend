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
app.delete('/thumbnail/:songId', songController.deleteThumbnails); // Delete thumbnails by songId
app.patch('/favourite/:songId', songController.toggleFavourite);
app.get('/stream/audio/:filename', (req, res) => {
  const filename = req.params.filename;
  const audioFilePath = path.join(__dirname, 'assets', 'audio', `${filename}`);

  if (!fs.existsSync(audioFilePath)) {
    return res.status(404).send(audioFilePath);
  }

  const stat = fs.statSync(audioFilePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      return res.status(416).send('Requested range not satisfiable');
    }

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(audioFilePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'audio/mpeg',
    });

    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
    });
    fs.createReadStream(audioFilePath).pipe(res);
  }
});

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
