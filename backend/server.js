const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const connectDB = require("./config/db");

// Initialize Express app
const app = express();
const port = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use("/assets/thumbnails", express.static(path.join(__dirname, "assets", "thumbnails")));

// Import Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/artists", require("./routes/artistRoutes"));
app.use("/songs", require("./routes/songRoutes"));
app.use("/playlists", require("./routes/playlistRoutes"));

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.message);
  res.status(err.status || 500).send({ error: err.message || "Internal Server Error" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
