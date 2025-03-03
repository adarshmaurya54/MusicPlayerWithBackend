const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const connectDB = require("./config/db");

// Initialize Express app
const app = express();
const port = process.env.PORT || 8080;

// Start server immediately
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  initializeApp(); // Initialize database and other operations after server starts
});

// Initialization function to connect to the database and set up routes
async function initializeApp() {
  try {
    console.log("Initializing app...");

    // Connect to MongoDB
    console.time("MongoDB Connection Time");
    await connectDB();
    console.timeEnd("MongoDB Connection Time");
    console.log("MongoDB connected successfully.");

    // Middleware setup
    app.use(cors());
    app.use(express.json());
    app.use(
      "/assets/thumbnails",
      express.static(path.join(__dirname, "assets", "thumbnails"))
    );

    // Import controllers
    const artistController = require("./controllers/artistController");
    const songController = require("./controllers/songController");
    const authController = require("./controllers/authController");

    // Set up routes
    app.get("/", (req, res) => res.send("Server is running!"));
    app.post("/login", authController.login);
    app.post("/signup", authController.signup);
    app.get("/songs", songController.getAllSongs);
    app.get("/artists", artistController.getAllArtists);
    app.get("/song/:fileId", songController.getSongWithMetadata);
    app.delete("/thumbnail/:songId", songController.deleteThumbnails);
    app.patch("/favourite/:songId", songController.toggleFavourite);
    app.get("/stream/:fileId", songController.streamAudio);
    app.post("/validate-token", authController.validateToken);

    // Lazy load protected routes
    const verifyToken = require("./middelware/verifyToken");
    app.use(verifyToken);
    const multer = require("multer");
    const upload = multer({ storage: multer.memoryStorage() });
    app.post("/song", upload.single("audioFile"), songController.createSong);
    app.get("/songById/:songId", songController.getSongById);
    app.put("/song/:songId", songController.updateSongById);
    app.delete("/song/:songId", songController.deleteSongById);

    // Error handler
    app.use((err, req, res, next) => {
      console.error("Error occurred:", err.message);
      res
        .status(err.status || 500)
        .send({ error: err.message || "Internal Server Error" });
    });

    console.log("App initialized successfully.");
  } catch (error) {
    console.error("Error during app initialization:", error);
  }
}
