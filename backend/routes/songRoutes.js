const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const songController = require("../controllers/songController");
const verifyToken = require("../middleware/verifyToken");

// Public routes (No token required)
router.get("/", songController.getAllSongs);
router.get("/liked-songs", verifyToken, songController.getLikedSongs); // Move it here
router.get("/share/:fileId", songController.shareSong);
router.get("/:fileId", songController.getSongWithMetadata);
router.get("/stream/:fileId", songController.streamAudio);
router.delete("/thumbnail/:songId", songController.deleteThumbnails);

// Protected routes (Require Token)
router.post("/", verifyToken, upload.single("audioFile"), songController.createSong);
router.get("/songById/:songId", verifyToken, songController.getSongById);
router.put("/:songId", verifyToken, songController.updateSongById);
router.delete("/:songId", verifyToken, songController.deleteSongById);
router.patch("/favourite/:songId", verifyToken, songController.toggleFavourite);
router.post("/like/:songId", verifyToken, songController.songLike);


module.exports = router;
